
import { YearlyOverviewTableRenderer } from "./yearly-overview-table-renderer.js";
import { initYearFormValidation } from "./year-form-validation.js";
import { CategoryReport } from "./category-report.js";

const YEAR_REPORT_API = "/year/report"
const YEARLY_OVERVIEW_CONTAINER_ID = 'yearly-overview-container';

$(document).ready(function () {
    initYearFormValidation("#year-form");

    const yearForm = document.getElementById('year-form');
    yearForm.addEventListener('change', updateYearlyOverview);

    updateYearlyOverview()
});


async function updateYearlyOverview() {
    if (!$("#year-form").valid())
        return;

    clearYearlyOverview();
    showLoader();

    try {
        await renderYearlyOverview();
    }
    catch (error) {
        console.error("Error rendering yearly overview:", error);
        renderError();
    }
    finally {
        hideLoader();
    }
}

function clearYearlyOverview() {
    const container = document.getElementById(YEARLY_OVERVIEW_CONTAINER_ID);
    container.innerHTML = '';
}

function showLoader() {
    const loader = document.getElementById("loader");
    if (loader != null)
        loader.classList.remove("d-none");
}

function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader != null)
        loader.classList.add("d-none");
}

async function renderYearlyOverview() {
    const year = getYearFromForm();
    const yearReport = await fetchYearReport(year);
    
    const rawReports = yearReport.category_reports;
    const categoryReports = convertToCategoryReports(rawReports);
    const yearlyTotal = yearReport.yearly_total;
    const renderer = new YearlyOverviewTableRenderer();
    const table = renderer.render(categoryReports, yearlyTotal);
    
    const container = document.getElementById(YEARLY_OVERVIEW_CONTAINER_ID);
    container.innerHTML = '';
    container.appendChild(table);
}

function getYearFromForm() {
    const yearInput = document.getElementById('id_year');
    return parseInt(yearInput.value);
}

async function fetchYearReport(year) {
    try {
        const data = await $.ajax({
            type: "GET",
            url: YEAR_REPORT_API,
            dataType: "json",
            data: { year: year }
        });
        return data.year_report;
    }
    catch (error) {
        console.error("Error fetching year report:", error);
        throw new Error("Failed to fetch year report");
    }
}

/**
 * Converts raw reports into CategoryReport instances.
 * @param {Array} rawReports - The raw reports to convert.
 * @returns {CategoryReport[]} - The converted CategoryReport instances.
 */
function convertToCategoryReports(rawReports) {
    return rawReports.map(report => new CategoryReport(
        report.category,
        report.monthly_totals,
        report.monthly_average,
        report.yearly_total
    ));
}

function renderError() {
    const message = "Ooops, something went wrong while loading the yearly overview. Check log for details.";
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('alert', 'alert-danger', 'd-flex', 'align-items-start', 'gap-3', 'p-4', 'rounded-4', 'shadow-sm');
    errorDiv.setAttribute('role', 'alert');
    errorDiv.innerHTML = `
        <i class="bi bi-x-octagon-fill fs-1"></i>
        <div id="error-box">
            <h4 class="alert-heading mb-2">Ooops! Something broke</h4>
            <p class="mb-3">${message}</p>
        </div>
    `;
    const container = document.getElementById('yearly-overview-container');
    container.innerHTML = '';
    container.appendChild(errorDiv);
}
