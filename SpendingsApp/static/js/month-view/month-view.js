
import { renderMonthTable } from './month-table-renderer.js';
import { initMonthFormValidation } from './month-form-validate.js';


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

        updateMonthTable();
    });

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
        
        let spendings = [];
        try {
            spendings = await getSpendingsForMonth(monthField.value, yearField.value);
        }
        catch (error) {
            console.error('Error updating month table', error);
        }
        renderMonthTable(spendings);
    }

    async function getSpendingsForMonth(monthName, year) {
        let parsed;
        try {
            parsed = parseMonthYear(monthName, year);
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

    function parseMonthYear(monthName, year) {
        const monthLabel = String(monthName).toLowerCase();
        const monthLabelCap = firstToUpperCase(monthLabel);

        const parsed = dateFns.parse(`${monthLabelCap} ${year}`, 'MMMM yyyy', new Date());
        if (!dateFns.isValid(parsed)) 
            throw new Error('Invalid month/year');
        
        return parsed;
    }

    function firstToUpperCase(str) {
        if (!str) 
            return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

})();
