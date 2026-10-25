"""
FlowGrid Twilio SMS Notifications & Mainframe Alert Control API.
Provides endpoints for:
1. Viewing and updating notification rules with on/off toggle switches.
2. Managing Twilio credentials (Account SID, Auth Token with hide/show, phone numbers).
3. Analyzing and optimizing SMS message token and segment usage.
4. Sending SMS alerts with minimum token consumption.
5. Scanning mainframe mainframe datasets for fuel, road, and agent disruption triggers.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import require_roles, AuthenticatedUser, VIEWER_ROLES, OPERATOR_ROLES
from app.services.twilio_service import (
    TwilioNotificationService,
    analyze_sms_tokens,
    minify_sms_content,
)

router = APIRouter(prefix="/notifications", tags=["SMS & Notifications Hub"])


# --- Schemas ---

class RuleUpdateRequest(BaseModel):
    is_enabled: Optional[bool] = None
    message_content: Optional[str] = None


class SendSmsRequest(BaseModel):
    message_content: str = Field(..., min_length=1, max_length=1600)
    to_phone: Optional[str] = None
    rule_category: Optional[str] = "CUSTOM_ALERT"
    account_sid: Optional[str] = None
    auth_token: Optional[str] = None
    from_phone: Optional[str] = None


class TwilioConfigUpdateRequest(BaseModel):
    account_sid: Optional[str] = None
    auth_token: Optional[str] = None
    from_phone: Optional[str] = None
    recipient_phone: Optional[str] = None


class MinifyRequest(BaseModel):
    text: str
    target_limit: Optional[int] = 150


# --- Endpoints ---

@router.get("/rules", summary="Get all notification rules and on/off toggle states")
def get_notification_rules(
    current_user: AuthenticatedUser = Depends(require_roles(VIEWER_ROLES)),
) -> List[Dict[str, Any]]:
    """Returns active notification rules with token metrics and toggle states."""
    return TwilioNotificationService.get_rules()


@router.put("/rules/{rule_id}", summary="Update rule on/off toggle or message content")
def update_notification_rule(
    rule_id: str,
    payload: RuleUpdateRequest,
    current_user: AuthenticatedUser = Depends(require_roles(OPERATOR_ROLES)),
) -> Dict[str, Any]:
    """Toggles a notification rule on/off or updates its carried SMS message content."""
    updates = payload.model_dump(exclude_unset=True)
    updated = TwilioNotificationService.update_rule(rule_id, updates)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Notification rule '{rule_id}' not found.",
        )
    return updated


@router.get("/config", summary="Get Twilio gateway configuration status")
def get_twilio_config(
    current_user: AuthenticatedUser = Depends(require_roles(VIEWER_ROLES)),
) -> Dict[str, Any]:
    """Returns Twilio configuration with masked authentication token."""
    return TwilioNotificationService.get_effective_credentials()


@router.post("/config", summary="Update Twilio gateway credentials")
def update_twilio_config(
    payload: TwilioConfigUpdateRequest,
    current_user: AuthenticatedUser = Depends(require_roles(OPERATOR_ROLES)),
) -> Dict[str, Any]:
    """Updates active credentials in-process."""
    creds = TwilioNotificationService.get_effective_credentials(
        override_sid=payload.account_sid,
        override_token=payload.auth_token,
        override_from=payload.from_phone,
        override_to=payload.recipient_phone,
    )
    return {
        "status": "CONFIG_UPDATED",
        "account_sid": creds["account_sid"],
        "masked_token": creds["masked_token"],
        "from_phone": creds["from_phone"],
        "recipient_phone": creds["recipient_phone"],
        "is_real_twilio": creds["is_real_twilio"],
    }


@router.post("/send", summary="Dispatch SMS alert via Twilio")
def send_notification_sms(
    payload: SendSmsRequest,
    current_user: AuthenticatedUser = Depends(require_roles(OPERATOR_ROLES)),
) -> Dict[str, Any]:
    """
    Sends SMS alert to recipient with minimum token optimization.
    Returns Twilio delivery SID, status, segments, and token usage.
    """
    return TwilioNotificationService.send_sms(
        body=payload.message_content,
        to_phone=payload.to_phone,
        rule_category=payload.rule_category or "NOTIFICATION",
        account_sid=payload.account_sid,
        auth_token=payload.auth_token,
        from_phone=payload.from_phone,
    )


@router.post("/analyze-token", summary="Analyze message token value and segments")
def analyze_token(
    payload: MinifyRequest,
    current_user: AuthenticatedUser = Depends(require_roles(VIEWER_ROLES)),
) -> Dict[str, Any]:
    """Calculates character count, GSM-7 vs UCS-2 encoding, and Twilio segments."""
    return analyze_sms_tokens(payload.text)


@router.post("/minify", summary="Minify message content to guarantee 1 SMS segment")
def minify_message(
    payload: MinifyRequest,
    current_user: AuthenticatedUser = Depends(require_roles(VIEWER_ROLES)),
) -> Dict[str, Any]:
    """Auto-minifies text using FMCG abbreviations to fit within single SMS segment."""
    minified = minify_sms_content(payload.text, target_limit=payload.target_limit or 150)
    token_stats = analyze_sms_tokens(minified)
    return {
        "original_text": payload.text,
        "minified_text": minified,
        "token_stats": token_stats,
    }


@router.get("/logs", summary="Get SMS dispatch audit log")
def get_notification_logs(
    limit: int = 50,
    current_user: AuthenticatedUser = Depends(require_roles(VIEWER_ROLES)),
) -> List[Dict[str, Any]]:
    """Returns history of dispatched SMS alerts."""
    return TwilioNotificationService.get_logs(limit=limit)


@router.post("/scan-mainframe", summary="Scan mainframe triggers for fuel, road, and agent alerts")
def scan_mainframe(
    auto_dispatch_enabled: bool = False,
    current_user: AuthenticatedUser = Depends(require_roles(OPERATOR_ROLES)),
) -> Dict[str, Any]:
    """
    Scans the mainframe codebase for:
    - Fuel price surges
    - Road & Ghat weather/traffic issues
    - Delivery agent stalls
    Optionally dispatches SMS for any active enabled rules.
    """
    scan_results = TwilioNotificationService.scan_mainframe_triggers()
    dispatched = []

    if auto_dispatch_enabled:
        for trigger in scan_results.get("enabled_triggers", []):
            sms_res = TwilioNotificationService.send_sms(
                body=trigger["suggested_message"],
                rule_category=trigger["category"],
            )
            dispatched.append(sms_res)

    scan_results["dispatched_count"] = len(dispatched)
    scan_results["dispatched_alerts"] = dispatched
    return scan_results
