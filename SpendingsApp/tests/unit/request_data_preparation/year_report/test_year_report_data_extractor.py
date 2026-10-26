import pytest
from unittest.mock import Mock

from SpendingsApp.finance.user_data import UserData
from SpendingsApp.request_data_preparation.user_converter import UserConverter
from SpendingsApp.request_data_preparation.year_report.year_report_data_extractor import YearReportDataExtractor


@pytest.fixture
def user_converter_mock() -> Mock:
    mock = Mock(spec=UserConverter)
    mock.convert_to_user.return_value = UserData(id=1, name="Test User")
    return mock


@pytest.fixture
def data_extractor(user_converter_mock: Mock) -> YearReportDataExtractor:
    return YearReportDataExtractor(user_converter_mock)


def get_example_request_data(year: object = 2020, user: object = "user") -> dict:
    return {"year": year, "user": user}


def test_extract_shouldRaiseExceptionIfYearIsMissing(data_extractor: YearReportDataExtractor) -> None:
    with pytest.raises(ValueError) as error:
        data_extractor.extract_year_report_data({"user": "user"})

    assert "Missing required field: year" == str(error.value)


@pytest.mark.parametrize("year", ["invalid", "test", -1, -202, "-2025"])
def test_extract_shouldRaiseExceptionIfYearIsInvalid(
        data_extractor: YearReportDataExtractor, year: object) -> None:
    with pytest.raises(ValueError) as error:
        data_extractor.extract_year_report_data(get_example_request_data(year))

    expected = "Invalid year format: expected an integer greater than or equal to 0."
    assert expected == str(error.value)


@pytest.mark.parametrize("year", [2020, 0, 9999, '2025'])
def test_extract_shouldReturnYearIfValid(
        data_extractor: YearReportDataExtractor, year: any) -> None:
    report_data = data_extractor.extract_year_report_data(get_example_request_data(year))

    expected = int(year)
    actual = report_data.year
    assert expected == actual


def test_extract_shouldRaiseExceptionIfUserIsMissing(
        data_extractor: YearReportDataExtractor,
        user_converter_mock: Mock) -> None:
    with pytest.raises(ValueError) as error:
        request_data = {"year": 2020}
        data_extractor.extract_year_report_data(request_data)

    assert "Missing required field: user" == str(error.value)
    user_converter_mock.convert_to_user.assert_not_called()


@pytest.mark.parametrize("user_input, expected_message", [
    ({"id": -1}, "user data {'id': -1} does not match any user."),
    ({"id": 999, "name": "ghost"}, "user data {'id': 999, 'name': 'ghost'} does not match any user."),
    ("unknown", "user data unknown does not match any user."),
    (42, 'user data 42 does not match any user.'),
])
def test_extract_shouldRaiseSafeErrorIfUserIsInvalid(
        data_extractor: YearReportDataExtractor,
        user_converter_mock: Mock,
        user_input: object,
        expected_message: str) -> None:
    user_converter_mock.convert_to_user.side_effect = Exception("internal converter failure")

    with pytest.raises(ValueError) as error:
        request_data = get_example_request_data(user=user_input)
        data_extractor.extract_year_report_data(request_data)

    assert expected_message == str(error.value)


@pytest.mark.parametrize("request_user, expected_user", [
    ("user", UserData(id=7, name="Report User")),
    ({"id": 1, "name": "Test User"}, UserData(id=1, name="Test User")),
    (202, UserData(id=202, name="Another User")),
])
def test_extract_shouldConvertAndReturnUser(
        data_extractor: YearReportDataExtractor,
        user_converter_mock: Mock,
        request_user: object,
        expected_user: UserData) -> None:
    user_converter_mock.convert_to_user.return_value = expected_user

    request_data = get_example_request_data(user=request_user)
    report_data = data_extractor.extract_year_report_data(request_data)

    user_converter_mock.convert_to_user.assert_called_once_with(request_user)
    assert expected_user == report_data.user