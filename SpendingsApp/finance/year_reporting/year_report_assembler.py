
from SpendingsApp.finance.year_reporting.category_report_gateway import CategoryReportGateway
from SpendingsApp.finance.user_data import UserData

from .year_report import CategoryReport, YearReport


class YearReportAssembler:

    def __init__(self, category_report_gateway: CategoryReportGateway):
        self._report_gateway = category_report_gateway

    def get_year_report2(self, year: int, user: UserData) -> YearReport:
        if year < 0:
                    raise ValueError(f"Year {year} is not valid. Year must be >=0")
        
        category_reports = self._report_gateway.get_category_reports(year, user)
        yearly_total = self.calc_yearly_total(category_reports)
        return YearReport(year, user, yearly_total, category_reports)

    def get_year_report(self, year: int) -> YearReport:
        if year < 0:
            raise ValueError(f"Year {year} is not valid. Year must be >=0")

        category_reports = self._report_gateway.get_category_reports(year)
        yearly_total = self.calc_yearly_total(category_reports)
        return YearReport(year, yearly_total, category_reports)

    def calc_yearly_total(self, category_reports: list[CategoryReport]) -> float:
        return sum(category_report.yearly_total for category_report in category_reports)

    
        