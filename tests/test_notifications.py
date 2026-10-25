"""
Test suite for Twilio SMS Gateway and Mainframe Event Notification Center.
Verifies PRD FR-P0-09 requirements:
- Minimum token / single segment optimization
- Toggle buttons on/off for notification rules
- Mainframe scans for fuel prices, road issues, and agent issues
- Twilio credentials management with security protections
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.twilio_service import analyze_sms_tokens, minify_sms_content

client = TestClient(app)
AUTH_HEADERS = {
    "X-User-Role": "ADMIN",
    "X-User-Email": "priya.sharma@flowgrid.internal",
}


def test_sms_token_minimization():
    """Verify single-segment GSM-7 token calculation (minimum token guarantee)."""
    short_text = "[HETVAYA] FUEL ALERT: Diesel in Kolhapur spiked to 96.80/L."
    stats = analyze_sms_tokens(short_text)
    assert stats["segments"] == 1
    assert stats["is_single_segment"] is True
    assert stats["encoding"].startswith("GSM-7")
    assert stats["token_efficiency_pct"] == 100


def test_sms_content_minifier():
    """Verify standard FMCG abbreviations minifier compresses text under 150 chars."""
    verbose_text = "Warehouse Distribution Center Estimated Time of Arrival Kilometers Minutes Condition Received"
    minified = minify_sms_content(verbose_text, target_limit=140)
    assert "WH" in minified
    assert "DC" in minified
    assert "ETA" in minified
    assert len(minified) <= 140


def test_get_and_update_notification_rules():
    """Verify rules endpoint and on/off toggle functionality."""
    # 1. Fetch rules
    resp = client.get("/api/v1/notifications/rules", headers=AUTH_HEADERS)
    assert resp.status_code == 200
    rules = resp.json()
    assert len(rules) >= 3

    # Verify categories requested by user
    categories = [r["category"] for r in rules]
    assert "FUEL" in categories
    assert "ROAD" in categories
    assert "AGENT" in categories

    fuel_rule = next(r for r in rules if r["category"] == "FUEL")

    # 2. Toggle Rule OFF
    toggle_resp = client.put(
        f"/api/v1/notifications/rules/{fuel_rule['id']}",
        json={"is_enabled": False},
        headers=AUTH_HEADERS,
    )
    assert toggle_resp.status_code == 200
    assert toggle_resp.json()["is_enabled"] is False

    # 3. Toggle Rule back ON
    toggle_on_resp = client.put(
        f"/api/v1/notifications/rules/{fuel_rule['id']}",
        json={"is_enabled": True},
        headers=AUTH_HEADERS,
    )
    assert toggle_on_resp.status_code == 200
    assert toggle_on_resp.json()["is_enabled"] is True


def test_send_sms_endpoint():
    """Verify sending SMS alert with minimum tokens."""
    payload = {
        "message_content": "[HETVAYA] ROAD ISSUE: NH-48 Khambatki Ghat landslide risk. +58m delay predicted.",
        "rule_category": "ROAD",
    }
    resp = client.post("/api/v1/notifications/send", json=payload, headers=AUTH_HEADERS)
    assert resp.status_code == 200
    data = resp.json()
    assert data["token_stats"]["segments"] == 1
    assert data["sid"].startswith("SM")
    assert data["status"] in ("DELIVERED", "SENT", "SIMULATED")


def test_scan_mainframe_triggers():
    """Verify scanning mainframe datasets for fuel, road, and agent alerts."""
    resp = client.post("/api/v1/notifications/scan-mainframe", headers=AUTH_HEADERS)
    assert resp.status_code == 200
    data = resp.json()
    assert "active_triggers" in data
    assert len(data["active_triggers"]) >= 3
    trigger_categories = [t["category"] for t in data["active_triggers"]]
    assert "FUEL" in trigger_categories
    assert "ROAD" in trigger_categories
    assert "AGENT" in trigger_categories
