
from dataclasses import dataclass
from ..category_data import CategoryData
from ..user_data import UserData


@dataclass
class CategoryReport:
    category: CategoryData
    monthly_totals: list[float] # index 0 = January ... 11 = December
    monthly_average: float

    def __post_init__(self):
        if len(self.monthly_totals) != 12:
            message = f"Expected 12 monthly totals, got {len(self.monthly_totals)}"
            raise ValueError(message)

    @property
    def yearly_total(self) -> float:
        return sum(self.monthly_totals)


@dataclass
class YearReport:
    year: int
    user: UserData
    yearly_total: float
    category_reports: list[CategoryReport]