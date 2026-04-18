from datetime import date, timedelta

CONSULT_MODES = ("Video", "In-Clinic")


def _build_upcoming_date_keys(days_to_show: int = 7) -> list[str]:
    today = date.today()
    return [(today + timedelta(days=i)).isoformat() for i in range(days_to_show)]


upcoming_date_keys = _build_upcoming_date_keys()

mock_doctors = [
    {
        "id": "doc-1",
        "name": "Dr. Asha Rao",
        "specialty": "General Physician",
        "rating": 4.8,
        "fee": 499,
        "availability": {
            "Video": {
                upcoming_date_keys[0]: [
                    {"id": "1", "time": "09:00 AM", "status": "available", "group": "Morning"},
                    {"id": "2", "time": "09:30 AM", "status": "limited", "group": "Morning"},
                    {"id": "3", "time": "11:00 AM", "status": "unavailable", "group": "Morning"},
                    {"id": "4", "time": "02:00 PM", "status": "available", "group": "Afternoon"},
                    {"id": "5", "time": "06:30 PM", "status": "available", "group": "Evening"},
                ],
                upcoming_date_keys[1]: [
                    {"id": "6", "time": "10:00 AM", "status": "available", "group": "Morning"},
                    {"id": "7", "time": "12:30 PM", "status": "limited", "group": "Afternoon"},
                    {"id": "8", "time": "07:00 PM", "status": "available", "group": "Evening"},
                ],
            },
            "In-Clinic": {
                upcoming_date_keys[0]: [
                    {"id": "ic-1", "time": "10:30 AM", "status": "available", "group": "Morning"},
                    {"id": "ic-2", "time": "04:00 PM", "status": "limited", "group": "Afternoon"},
                ],
                upcoming_date_keys[2]: [
                    {"id": "ic-3", "time": "11:30 AM", "status": "available", "group": "Morning"},
                    {"id": "ic-4", "time": "05:45 PM", "status": "available", "group": "Evening"},
                ],
            },
        },
    },
    {
        "id": "doc-2",
        "name": "Dr. Naveen Kumar",
        "specialty": "Dermatologist",
        "rating": 4.6,
        "fee": 699,
        "availability": {
            "Video": {
                upcoming_date_keys[0]: [
                    {"id": "9", "time": "08:30 AM", "status": "available", "group": "Morning"},
                    {"id": "10", "time": "03:00 PM", "status": "available", "group": "Afternoon"},
                    {"id": "11", "time": "04:00 PM", "status": "unavailable", "group": "Afternoon"},
                ],
                upcoming_date_keys[2]: [
                    {"id": "12", "time": "09:30 AM", "status": "limited", "group": "Morning"},
                    {"id": "13", "time": "05:30 PM", "status": "available", "group": "Evening"},
                ],
            },
            "In-Clinic": {
                upcoming_date_keys[1]: [
                    {"id": "ic-5", "time": "09:15 AM", "status": "available", "group": "Morning"},
                    {"id": "ic-6", "time": "01:45 PM", "status": "available", "group": "Afternoon"},
                ],
                upcoming_date_keys[3]: [
                    {"id": "ic-7", "time": "10:45 AM", "status": "limited", "group": "Morning"},
                    {"id": "ic-8", "time": "06:00 PM", "status": "available", "group": "Evening"},
                ],
            },
        },
    },
]
