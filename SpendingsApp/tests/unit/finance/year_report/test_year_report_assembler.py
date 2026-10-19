

import pytest
from unittest.mock import Mock

from SpendingsApp.finance.category_data import CategoryData
from SpendingsApp.finance.user_data import UserData
from SpendingsApp.finance.year_reporting.category_report_gateway import CategoryReportGateway
from SpendingsApp.finance.year_reporting.year_report import CategoryReport
from SpendingsApp.finance.year_reporting.year_report_assembler import YearReportAssembler


TEST_YEAR = 2024
TEST_USER = UserData(id=1, name="testuser")

@pytest.fixture
def category_report_gateway():
    return Mock(spec=CategoryReportGateway)

@pytest.fixture
def make_assembler(category_report_gateway: Mock) -> YearReportAssembler:
    return YearReportAssembler(category_report_gateway)


def make_category_report(category_id: int, monthly_total: float) -> CategoryReport:
    return CategoryReport(
        category=CategoryData(id=category_id, name=f"Category {category_id}"),
        monthly_totals=[monthly_total] * 12,
        monthly_average=monthly_total,
    )


@pytest.mark.parametrize("negative_year", [-1, -2024, -100000])
def test_get_year_report_raises_for_negative_year(
    make_assembler: YearReportAssembler, category_report_gateway: Mock,
    negative_year: int,
):
    with pytest.raises(ValueError):
        make_assembler.assemble_year_report(negative_year, TEST_USER)

    category_report_gateway.get_category_reports.assert_not_called()


@pytest.mark.parametrize(
    "negative_year, expected_message",
    [
        (-1, "Year -1 is not valid. Year must be >=0"),
        (-2024, "Year -2024 is not valid. Year must be >=0"),
        (-100000, "Year -100000 is not valid. Year must be >=0"),
    ],
)
def test_get_year_report_negative_year_error_message(
    make_assembler: YearReportAssembler, negative_year: int, expected_message: str,
):
    with pytest.raises(ValueError) as exc_info:
        make_assembler.assemble_year_report(negative_year, TEST_USER)

    assert str(exc_info.value) == expected_message


@pytest.mark.parametrize("year", [0, 1, 1999, 2024, 9999])
@pytest.mark.parametrize(
    "user",
    [UserData(id=1, name="testuser"), UserData(id=2, name="otheruser")],
)
def test_get_year_report_requests_reports_for_given_year_and_user(
    make_assembler: YearReportAssembler, category_report_gateway: Mock,
    year: int, user: UserData,
):
    category_report_gateway.get_category_reports.return_value = []

    make_assembler.assemble_year_report(year, user)

    category_report_gateway.get_category_reports.assert_called_once_with(year, user)


@pytest.mark.parametrize("year", [0, 1, 1999, 2024, 9999])
@pytest.mark.parametrize("user", [UserData(id=1, name="testuser"), UserData(id=2, name="otheruser")])
def test_get_year_report_sets_year_and_user(
    make_assembler: YearReportAssembler, category_report_gateway: Mock, year: int, user: UserData,
):
    category_report_gateway.get_category_reports.return_value = []

    report = make_assembler.assemble_year_report(year, user)

    assert report.year == year
    assert report.user == user


@pytest.mark.parametrize(
    "category_totals",
    [
        [],
        [10],
        [10, 20],
        [5, 15, 25, 35],
    ],
)
def test_get_year_report_contains_category_reports_from_gateway(
    make_assembler: YearReportAssembler, category_report_gateway: Mock,
    category_totals: list[float],
):
    category_reports = [make_category_report(i + 1, total) for i, total in enumerate(category_totals)]
    category_report_gateway.get_category_reports.return_value = category_reports

    report = make_assembler.assemble_year_report(TEST_YEAR, TEST_USER)

    assert report.category_reports == category_reports


@pytest.mark.parametrize(
        "category_totals, expected_yearly_total",
        [
            ([5, 15, 25], 12 * (5 + 15 + 25)),
            ([10, 20], 360),
            ([0, 0, 0], 0),
            ([1, 2, 3, 4], 120),
            ([7, 8, 9], 288),
        ],
)
def test_get_year_report_yearly_total_is_sum_of_category_yearly_totals(
    make_assembler: YearReportAssembler, category_report_gateway: Mock,
    category_totals: list[float], expected_yearly_total: float,
):
    category_reports = [make_category_report(i + 1, total) for i, total in enumerate(category_totals)]
    category_report_gateway.get_category_reports.return_value = category_reports

    report = make_assembler.assemble_year_report(TEST_YEAR, TEST_USER)

    expected = expected_yearly_total
    actual = report.yearly_total
    assert actual == expected

