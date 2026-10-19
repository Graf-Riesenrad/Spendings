
from abc import ABC, abstractmethod

from ..user_data import UserData
from .year_report import CategoryReport


class CategoryReportGateway(ABC):

    @abstractmethod
    def get_category_reports(self, year: int, user: UserData) -> list[CategoryReport]:
        pass