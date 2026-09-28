
import { renderMonthTable } from './month-table-renderer.js';
import { initMonthFormValidation } from './month-form-validate.js';
import { MonthOfYear } from './month-of-year.js';
import { getNextMonth, getPreviousMonth, monthOfYearToDate } from './jump-month.js';



(function() {

    $(document).ready(function() {
        const form = document.getElementById('month-form');
        if(!form) 
            return;

        initMonthFormValidation('month-form');

        form.addEventListener('submit', function(ev) {
            ev.preventDefault();
        });

        form.addEventListener('change', updateMonthTable);

        const monthUpBtn = document.getElementById('month-up-btn');
        if (monthUpBtn) {
            monthUpBtn.addEventListener('click', function(ev) {
                ev.preventDefault();
                monthUp();
            });
        }
        
        const monthDownBtn = document.getElementById('month-down-btn');
        if (monthDownBtn) {
            monthDownBtn.addEventListener('click', function(ev) {
                ev.preventDefault();
                monthDown();
            });
        }

        updateMonthTable();
    });
    
    function monthUp() {
        const actualMonth = getActualMonthOfYear();
        const nextMonth = getNextMonth(actualMonth);
        setMonthOfYearAndUpdate(nextMonth);
    }
    
    function monthDown() {
        const actualMonth = getActualMonthOfYear();
        const prevMonth = getPreviousMonth(actualMonth);
        setMonthOfYearAndUpdate(prevMonth);
    }
    
    function getActualMonthOfYear() {
        const monthSelect = document.getElementById("id_month")
        const yearSelect = document.getElementById("id_year");
        return new MonthOfYear(monthSelect.value, parseInt(yearSelect.value));
    }
    
    function setMonthOfYearAndUpdate(monthOfYear) {
        const monthSelect = document.getElementById("id_month")
        const yearSelect = document.getElementById("id_year");
        monthSelect.value = monthOfYear.monthName.toUpperCase();
        yearSelect.value = monthOfYear.year;
        updateMonthTable();
    }
    
    async function updateMonthTable() {
        const form = document.getElementById('month-form');
        if(!form || !$(form).valid()) {
            console.log('Form not found or invalid');
            return;
        }

        const monthField = form.querySelector('[name="month"]');
        const yearField = form.querySelector('[name="year"]');
        if (!monthField || !yearField) {
            console.log('Month or year field not found');
            return;
        }

        const yearValue = yearField.value;
        if (yearValue.length !== 4)
            return;
        
        const actualMonth = new MonthOfYear(monthField.value, parseInt(yearField.value));
        let spendings = [];
        try {
            spendings = await getSpendingsForMonth(actualMonth);
        }
        catch (error) {
            console.error('Error updating month table', error);
        }
        renderMonthTable(spendings);
    }

    async function getSpendingsForMonth(monthOfYear) {
        let parsed;
        try {
            parsed = monthOfYearToDate(monthOfYear);
        } catch (error) {
            console.error('Error parsing month/year', error); // TODO: Show user-friendly error message
            throw error; 
        }

        const start = dateFns.startOfMonth(parsed);
        const end = dateFns.endOfMonth(parsed);
        const startIso = dateFns.format(start, 'yyyy-MM-dd');
        const endIso = dateFns.format(end, 'yyyy-MM-dd');

        try {
            const data = await $.ajax({
                type: 'GET',
                url: DJANGO_URLS.spending_get,
                data: { start_date: startIso, end_date: endIso },
            });
            return data.spendings;
        }
        catch (xhr) {
            console.error('Error fetching month spendings', xhr.status, xhr.responseText);
            throw xhr;
        }
    }
})();
