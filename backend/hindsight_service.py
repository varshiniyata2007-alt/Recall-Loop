import os
import json
import logging
import datetime
import asyncio
import threading
from typing import List, Dict, Any, Optional
from pathlib import Path
from backend.config import settings

logger = logging.getLogger("hindsight_service")

# Import official Hindsight SDK client
try:
    from hindsight_client import Hindsight
    from hindsight_client_api.exceptions import UnauthorizedException, ApiException
    HINDSIGHT_CLIENT_AVAILABLE = True
except ImportError:
    HINDSIGHT_CLIENT_AVAILABLE = False
    logger.error("hindsight-client package is required but not installed.")

class HindsightConfigurationError(Exception):
    """Raised when Hindsight is not properly configured or authenticated."""
    pass

class AsyncHindsightRunner:
    """Dedicated background event-loop runner for official Hindsight SDK client."""
    def __init__(self, api_url: str, api_key: Optional[str] = None):
        self.api_url = api_url
        self.api_key = api_key
        self.loop: Optional[asyncio.AbstractEventLoop] = None
        self.client: Optional[Any] = None
        self.thread: Optional[threading.Thread] = None
        if HINDSIGHT_CLIENT_AVAILABLE:
            self._start()

    def _start(self):
        ready = threading.Event()
        def runner():
            self.loop = asyncio.new_event_loop()
            asyncio.set_event_loop(self.loop)
            try:
                self.client = Hindsight(
                    base_url=self.api_url,
                    api_key=self.api_key if self.api_key else None
                )
            except Exception as e:
                logger.error(f"Failed to initialize Hindsight client: {e}")
                self.client = None
            ready.set()
            self.loop.run_forever()

        self.thread = threading.Thread(target=runner, daemon=True)
        self.thread.start()
        ready.wait()

    def run(self, coro_fn):
        if not self.loop or not self.client:
            raise HindsightConfigurationError("Hindsight client is not initialized.")
        future = asyncio.run_coroutine_threadsafe(coro_fn(self.client), self.loop)
        return future.result()

class HindsightService:
    def __init__(self):
        self.api_url = settings.HINDSIGHT_API_URL or "https://api.hindsight.vectorize.io"
        self.api_key = settings.HINDSIGHT_API_KEY or ""
        self.bank_id = settings.HINDSIGHT_BANK_ID or "recallloop-product-memory"
        self.runner: Optional[AsyncHindsightRunner] = None
        self._history_cache_file = Path(__file__).resolve().parent / "hindsight_history_cache.json"
        self._init_client()

    @property
    def client(self):
        return self.runner.client if self.runner else None

    def _init_client(self):
        self.api_url = settings.HINDSIGHT_API_URL or "https://api.hindsight.vectorize.io"
        self.api_key = settings.HINDSIGHT_API_KEY or ""
        self.bank_id = settings.HINDSIGHT_BANK_ID or "recallloop-product-memory"

        if not HINDSIGHT_CLIENT_AVAILABLE:
            self.runner = None
            return

        try:
            self.runner = AsyncHindsightRunner(
                api_url=self.api_url,
                api_key=self.api_key if self.api_key else None
            )
            # Ensure bank exists on the server
            try:
                self.runner.run(lambda c: c.acreate_bank(bank_id=self.bank_id))
            except Exception:
                pass
        except Exception as e:
            logger.error(f"Failed to instantiate Hindsight runner: {e}")
            self.runner = None

    def get_status(self) -> Dict[str, Any]:
        """Verify real Hindsight connection and credentials."""
        is_key_provided = bool(self.api_key and len(self.api_key) > 5)
        is_local = "localhost" in self.api_url or "127.0.0.1" in self.api_url

        status_info = {
            "sdk_installed": HINDSIGHT_CLIENT_AVAILABLE,
            "api_url": self.api_url,
            "bank_id": self.bank_id,
            "is_key_provided": is_key_provided,
            "is_local_server": is_local,
            "is_real_hindsight_active": False,
            "status": "unconfigured",
            "message": ""
        }

        if not HINDSIGHT_CLIENT_AVAILABLE:
            status_info["status"] = "sdk_missing"
            status_info["message"] = "The 'hindsight-client' python package is not installed."
            return status_info

        if not is_key_provided and not is_local:
            status_info["status"] = "unconfigured"
            status_info["message"] = (
                "HINDSIGHT_API_KEY is missing in .env. Real Hindsight Cloud requires an authentic key (starts with 'hsk_...'). "
                "Get your key at https://ui.hindsight.vectorize.io/signup or run a local server at http://localhost:8888."
            )
            return status_info

        # Probe the real Hindsight instance
        try:
            if self.runner and self.runner.client:
                # Real recall probe via persistent async runner
                self.runner.run(lambda c: c.arecall(bank_id=self.bank_id, query="ping probe", max_tokens=50))
                status_info["is_real_hindsight_active"] = True
                status_info["status"] = "connected"
                status_info["message"] = f"Connected to Real Hindsight at {self.api_url} (Bank: {self.bank_id})"
                return status_info
        except Exception as e:
            err_str = str(e)
            if "Unauthorized" in err_str or "401" in err_str or "Authentication failed" in err_str:
                status_info["status"] = "auth_failed"
                status_info["message"] = (
                    f"Real Hindsight Authentication Failed: Invalid or rejected API key for {self.api_url}. "
                    "Please configure a valid HINDSIGHT_API_KEY in .env."
                )
            else:
                status_info["status"] = "connection_error"
                status_info["message"] = f"Could not connect to Real Hindsight at {self.api_url}: {err_str}"
            return status_info

        return status_info

    def _read_cached_history(self) -> List[Dict[str, Any]]:
        if not self._history_cache_file.exists():
            return []
        try:
            with open(self._history_cache_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def _write_cached_history(self, history: List[Dict[str, Any]]):
        try:
            with open(self._history_cache_file, "w", encoding="utf-8") as f:
                json.dump(history, f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.error(f"Error caching history: {e}")

    def retain_experience(
        self,
        problem: str,
        action: str,
        result: str,
        context: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Retain experience in REAL Hindsight using the official SDK.
        NO SILENT LOCAL FALLBACK.
        """
        if not self.runner or not self.runner.client:
            self._init_client()

        if not self.runner or not self.runner.client:
            raise HindsightConfigurationError(
                "Hindsight client is not initialized. Please ensure hindsight-client is installed."
            )

        now = datetime.datetime.now(datetime.timezone.utc)
        iso_now = now.isoformat()

        content_text = (
            f"Product Problem: {problem}\n"
            f"Previous Action Taken: {action}\n"
            f"Previous Result / Outcome: {result}\n"
            f"Logged At: {iso_now}\n"
            f"Experience Summary: For problem '{problem}', the product team took action: '{action}'. The outcome was: '{result}'."
        )

        problem_slug = problem.lower().replace(" ", "_").replace("/", "_")
        tags = ["recallloop_experience", problem_slug]

        logger.info(f"Calling REAL Hindsight client.retain for '{problem}'...")

        try:
            # REAL OFFICIAL HINDSIGHT RETAIN CALL
            retain_res = self.runner.run(lambda c: c.aretain(
                bank_id=self.bank_id,
                content=content_text,
                context=context or f"RecallLoop Product Experience for {problem}",
                tags=tags
            ))
            hindsight_resp_str = str(retain_res)
        except Exception as e:
            err_msg = str(e)
            logger.error(f"Real Hindsight retain failed: {err_msg}")
            # DO NOT SILENTLY FALL BACK TO LOCAL MEMORY
            raise HindsightConfigurationError(
                f"Real Hindsight retain failed: {err_msg}. "
                "HINDSIGHT IS MANDATORY. If using Hindsight Cloud, ensure HINDSIGHT_API_KEY is set in .env. "
                "If using a local server, ensure it is running on HINDSIGHT_API_URL."
            )

        # Store in audit cache for visual loop history screen
        history = self._read_cached_history()
        entry = {
            "id": f"mem_{int(now.timestamp())}_{len(history)+1}",
            "problem": problem,
            "action": action,
            "result": result,
            "timestamp": iso_now,
            "formatted_text": content_text,
            "tags": tags,
            "source": "REAL_HINDSIGHT",
            "real_hindsight_synced": True,
            "hindsight_bank": self.bank_id,
            "raw_hindsight_response": hindsight_resp_str
        }
        history.append(entry)
        self._write_cached_history(history)

        return {
            "success": True,
            "memory": entry,
            "real_hindsight": True,
            "storage_source": "REAL_HINDSIGHT",
            "message": "Experience retained successfully in REAL Hindsight."
        }

    def recall_experience(
        self,
        problem: str,
        query: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Recall experience from REAL Hindsight using the official SDK.
        NO SILENT LOCAL FALLBACK.
        """
        if not self.runner or not self.runner.client:
            self._init_client()

        if not self.runner or not self.runner.client:
            raise HindsightConfigurationError("Hindsight client is not initialized.")

        search_query = query or f"What previous actions, fixes, or solutions were tried for {problem}, and what was the result or outcome?"

        logger.info(f"Calling REAL Hindsight client.recall for '{problem}'...")

        recalled_memories = []
        raw_results = []

        try:
            # REAL OFFICIAL HINDSIGHT RECALL CALL
            response = self.runner.run(lambda c: c.arecall(
                bank_id=self.bank_id,
                query=search_query,
                max_tokens=4096
            ))

            if hasattr(response, "results") and response.results:
                for item in response.results:
                    text_content = getattr(item, "text", str(item))
                    recalled_memories.append({
                        "id": getattr(item, "id", None) or "hsk_result",
                        "problem": problem,
                        "text": text_content,
                        "type": getattr(item, "type", "memory"),
                        "scores": getattr(item, "scores", {}),
                        "tags": getattr(item, "tags", []),
                        "source": "REAL_HINDSIGHT",
                        "occurred_start": str(getattr(item, "occurred_start", "")),
                    })
                    raw_results.append(text_content)

        except Exception as e:
            err_msg = str(e)
            logger.error(f"Real Hindsight recall failed: {err_msg}")
            # DO NOT SILENTLY FALL BACK TO LOCAL MEMORY
            raise HindsightConfigurationError(
                f"Real Hindsight recall failed: {err_msg}. "
                "HINDSIGHT IS MANDATORY. If using Hindsight Cloud, ensure HINDSIGHT_API_KEY is set in .env. "
                "If using a local server, ensure it is running on HINDSIGHT_API_URL."
            )

        has_experience = len(recalled_memories) > 0

        # Parse specific previous_action and previous_result dynamically from recalled memories
        parsed_action = None
        parsed_result = None

        if has_experience:
            for item in recalled_memories:
                text = item.get("text", "")
                for line in text.split("\n"):
                    lower_line = line.lower().strip()
                    if any(lower_line.startswith(prefix) for prefix in ["previous action taken:", "action taken:", "previous action:", "action:"]):
                        val = line.split(":", 1)[1].strip()
                        if " (mentioned_at=" in val:
                            val = val.split(" (mentioned_at=")[0].strip()
                        if not parsed_action:
                            parsed_action = val
                    elif any(lower_line.startswith(prefix) for prefix in ["previous result / outcome:", "previous result:", "result / outcome:", "result:", "outcome:"]):
                        val = line.split(":", 1)[1].strip()
                        if " (mentioned_at=" in val:
                            val = val.split(" (mentioned_at=")[0].strip()
                        if not parsed_result:
                            parsed_result = val
                if parsed_action and parsed_result:
                    break

        return {
            "has_relevant_experience": has_experience,
            "problem": problem,
            "query": search_query,
            "memories": recalled_memories,
            "previous_action": parsed_action,
            "previous_result": parsed_result,
            "source": "REAL_HINDSIGHT" if has_experience else "NONE",
            "is_real_hindsight": True,
            "raw_context": "\n\n".join(raw_results) if raw_results else ""
        }

    def get_all_history(self) -> List[Dict[str, Any]]:
        return self._read_cached_history()

    def clear_bank(self) -> Dict[str, Any]:
        self._write_cached_history([])
        if self.runner and self.runner.client:
            try:
                self.runner.run(lambda c: c.adelete_bank(bank_id=self.bank_id))
            except Exception as e:
                logger.debug(f"Could not delete bank {self.bank_id}: {e}")
            try:
                self.runner.run(lambda c: c.acreate_bank(bank_id=self.bank_id))
            except Exception as e:
                logger.debug(f"Could not create bank {self.bank_id}: {e}")
        return {
            "success": True,
            "message": "Memory bank reset. Ready for demonstration."
        }

# Global singleton
hindsight_service = HindsightService()
