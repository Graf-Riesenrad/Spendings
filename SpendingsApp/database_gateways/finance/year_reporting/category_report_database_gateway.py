
from datetime import date, timedelta

from SpendingsApp.models import Category, Spending

from SpendingsApp.finance.category_data import CategoryData
from SpendingsApp.finance.monthly_average.monthly_average_calculator import MonthlyAverageCalculator
from SpendingsApp.finance.user_data import UserData
from SpendingsApp.finance.year_reporting.category_report_gateway import CategoryReportGateway
from SpendingsApp.finance.year_reporting.year_report import CategoryReport



class CategoryReportDatabaseGateway(CategoryReportGateway):

    def __init__(self, monthly_average_calc: MonthlyAverageCalculator):
        self._monthly_average_calc = monthly_average_calc


    def get_category_reports(self, year: int, user: UserData) -> list[CategoryReport]:
        category_reports = []
        for category in self._get_all_categories(user):
            report = self._get_category_report(year, category, user)
            category_reports.append(report)
        return category_reports


    def _get_all_categories(self, user: UserData) -> list[CategoryData]:
        db_categories = Category.objects.filter(user__id=user.id)
        categories = []
        for db_category in db_categories:
            category_data = CategoryData(id=db_category.id, name=db_category.name)
            categories.append(category_data)
        return categories


    def _get_category_report(self, year: int, category: CategoryData, user: UserData) -> CategoryReport:
        monthly_totals = self._get_monthly_totals(year, category)
        average = self._monthly_average_calc.calculate_monthly_average(year, category, user)
        return CategoryReport(category, monthly_totals, average)
        

    def _get_monthly_totals(self, year: int, category: CategoryData) -> list[float]:
        totals = []
        for month_index in range(1, 13):
            start = date(year, month_index, 1)
            end = self._get_month_end(year, month_index)
            totals.append(self._get_total(start, end, category))
        return totals


    def _get_month_end(self, year: int, month: int) -> date:
        if month == 12:
            return date(year, 12, 31)
        else:
            return date(year, month + 1, 1) - timedelta(days=1)


    def _get_total(self, start: date, end: date, category: CategoryData) -> float:
        db_category = Category.objects.get(id=category.id)
        return sum(
            spending.amount
            for spending in Spending.objects.filter(
                spendingDate__gte=start,
                spendingDate__lte=end,
                category=db_category
            )
        )

    