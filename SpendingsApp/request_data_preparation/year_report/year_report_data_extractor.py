
from dataclasses import dataclass

from SpendingsApp.finance.user_data import UserData
from SpendingsApp.request_data_preparation.user_converter import UserConverter

@dataclass
class YearReportRequestData:
    year: int
    user: UserData

YEAR_FIELD = "year"
USER_FIELD = "user"


class YearReportDataExtractor:

    def __init__(self, user_converter: UserConverter):
        self._user_converter = user_converter

    def extract_year_report_data(self, request_data: dict[str, any]) -> YearReportRequestData:
        year = self._extract_year(request_data)
        user = self._extract_user(request_data)
        return YearReportRequestData(year, user=user)

    def _extract_year(self, request_data: dict[str, any]) -> int:
        if YEAR_FIELD not in request_data:
            raise ValueError(f"Missing required field: {YEAR_FIELD}")

        year = request_data[YEAR_FIELD]
        if not isinstance(year, int) or year < 0:
            raise ValueError("Invalid year format: expected an integer greater than or equal to 0.")

        return year

    def _extract_user(self, request_data: dict[str, any]) -> UserData:
        if USER_FIELD not in request_data:
            raise ValueError(f"Missing required field: {USER_FIELD}")

        user_data = request_data[USER_FIELD]
        try:
            return self._user_converter.convert_to_user(user_data)
        except Exception:
            raise ValueError(f"user data {user_data} does not match any user.")