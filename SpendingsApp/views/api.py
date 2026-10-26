

from dataclasses import asdict
from http import HTTPStatus

from django.http import HttpRequest, HttpResponse, HttpResponseBadRequest, JsonResponse

from SpendingsApp.views.auth_views import AuthenticatedView
from SpendingsApp.database_gateways.database_user_converter import DatabaseUserConverter
from SpendingsApp.database_gateways.database_category_converter import DatabaseCategoryConverter
from SpendingsApp.database_gateways.finance.monthly_average.monthly_average_database_gateway import MonthlyAverageDatabaseGateway
from SpendingsApp.finance.monthly_average.monthly_average_calculator import MonthlyAverageCalculator
from SpendingsApp.request_data_preparation.monthly_average.monthly_average_data_preparer import MonthlyAverageDataPreparer

from SpendingsApp.factories import YearReportApiFactory

class YearReportApi(AuthenticatedView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._year_report_assembler = YearReportApiFactory.make_year_report_assembler()
        self._year_report_data_extractor = YearReportApiFactory.make_year_data_extractor()

    def get(self, request: HttpRequest) -> HttpResponse:
        input_data = {
            'year': request.GET.get('year'),
            'user': request.user,
        }
        try:
            extracted_data = self._year_report_data_extractor.extract_year_report_data(input_data)
        except ValueError as e:
            print(f"Error extracting year report data: {e}")
            return HttpResponseBadRequest(str(e))

        year_report = self._year_report_assembler.assemble_year_report(extracted_data.year, extracted_data.user)
        return JsonResponse({'year_report': asdict(year_report)}, status=HTTPStatus.OK)
    

class MonthlyAverageApi(AuthenticatedView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        category_converter = DatabaseCategoryConverter()
        user_converter = DatabaseUserConverter()
        self._data_preparer = MonthlyAverageDataPreparer(category_converter, user_converter)
        self._database_gateway = MonthlyAverageDatabaseGateway()
        self._average_calculator = MonthlyAverageCalculator(self._database_gateway)

    def get(self, request: HttpRequest) -> HttpResponse:
        request_data = {
            'year': request.GET.get('year'),
            'category': request.GET.get('category'),
            'user': request.user,
        }
        try:
            average_request_data = self._data_preparer.extract_average_data(request_data)
        except ValueError as e:
            return HttpResponseBadRequest(str(e))

        year = average_request_data.year
        category = average_request_data.category
        user = average_request_data.user
        average = self._average_calculator.calculate_monthly_average(year, category, user)
        
        data = {
            'average': average,
            'year': year,
            'category': asdict(category),
        }
        return JsonResponse(data, status=HTTPStatus.OK)