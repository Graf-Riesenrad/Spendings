
from SpendingsApp.database_gateways.database_category_converter import DatabaseCategoryConverter
from SpendingsApp.database_gateways.finance.monthly_average.monthly_average_database_gateway import MonthlyAverageDatabaseGateway
from SpendingsApp.database_gateways.finance.year_reporting.category_report_database_gateway import CategoryReportDatabaseGateway
from SpendingsApp.finance.monthly_average.monthly_average_calculator import MonthlyAverageCalculator
from SpendingsApp.finance.year_reporting.year_report_assembler import YearReportAssembler
from SpendingsApp.request_data_preparation.year_report.year_report_data_extractor import YearReportDataExtractor
from SpendingsApp.request_data_preparation.user_converter import UserConverter


class YearReportApiFactory:
    @staticmethod
    def make_year_report_assembler() -> YearReportAssembler:
        average_calculator = MonthlyAverageCalculator(MonthlyAverageDatabaseGateway())
        report_gateway = CategoryReportDatabaseGateway(average_calculator, DatabaseCategoryConverter())
        return YearReportAssembler(report_gateway)

    @staticmethod
    def make_year_data_extractor() -> YearReportDataExtractor:
        user_converter = UserConverter()
        return YearReportDataExtractor(user_converter)
