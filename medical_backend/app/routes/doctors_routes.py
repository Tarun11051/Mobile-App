from datetime import date
from typing import Optional
from fastapi import APIRouter, HTTPException, Query

from app.data.mock_doctors import CONSULT_MODES, mock_doctors

router = APIRouter(prefix="/api/doctors", tags=["Doctors"])


def _validate_date(date_value: Optional[str]) -> str:
    if not date_value:
        raise HTTPException(
            status_code=400,
            detail="Invalid or missing `date`. Use format YYYY-MM-DD.",
        )

    try:
        parsed = date.fromisoformat(date_value)
        return parsed.isoformat()
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail="Invalid or missing `date`. Use format YYYY-MM-DD.",
        ) from exc


def _validate_mode(mode_value: Optional[str]) -> str:
    if not mode_value:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid or missing `mode`. Allowed values: {', '.join(CONSULT_MODES)}.",
        )

    if mode_value not in CONSULT_MODES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid or missing `mode`. Allowed values: {', '.join(CONSULT_MODES)}.",
        )
    return mode_value


@router.get("")
async def get_doctors(
    date_value: Optional[str] = Query(None, alias="date"),
    mode: Optional[str] = Query(None),
):
    selected_date = _validate_date(date_value)
    selected_mode = _validate_mode(mode)

    doctors = [
        {
            "id": doctor["id"],
            "name": doctor["name"],
            "specialty": doctor["specialty"],
            "rating": doctor["rating"],
            "fee": doctor["fee"],
            "slots": doctor["availability"].get(selected_mode, {}).get(selected_date, []),
        }
        for doctor in mock_doctors
    ]

    return {
        "date": selected_date,
        "mode": selected_mode,
        "doctors": doctors,
    }


@router.get("/{doctor_id}/slots")
async def get_doctor_slots(
    doctor_id: str,
    date_value: Optional[str] = Query(None, alias="date"),
    mode: Optional[str] = Query("Video"),
):
    selected_date = _validate_date(date_value)
    selected_mode = _validate_mode(mode)

    doctor = next((doc for doc in mock_doctors if doc["id"] == doctor_id), None)
    if doctor is None:
        raise HTTPException(status_code=404, detail="Doctor not found.")

    return {
        "doctor": {
            "id": doctor["id"],
            "name": doctor["name"],
            "specialty": doctor["specialty"],
            "rating": doctor["rating"],
            "fee": doctor["fee"],
        },
        "date": selected_date,
        "mode": selected_mode,
        "slots": doctor["availability"].get(selected_mode, {}).get(selected_date, []),
    }
