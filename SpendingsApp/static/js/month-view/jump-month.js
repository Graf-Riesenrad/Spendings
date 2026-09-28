
import { MonthOfYear } from './month-of-year.js';


export function getNextMonth(actualMonth) {
    const monthDate = monthOfYearToDate(actualMonth);
    const nextMonth = dateFns.addMonths(monthDate, 1);
    const newMonthName = dateFns.format(nextMonth, 'MMMM');
    const newYear = nextMonth.getFullYear();
    return new MonthOfYear(newMonthName, newYear);
}

export function getPreviousMonth(actualMonth) {
    const monthDate = monthOfYearToDate(actualMonth);
    const prevMonth = dateFns.subMonths(monthDate, 1);
    const newMonthName = dateFns.format(prevMonth, 'MMMM');
    const newYear = prevMonth.getFullYear();
    return new MonthOfYear(newMonthName, newYear);
}

export function monthOfYearToDate(monthOfYear) {
    const monthText = adjustCasing(monthOfYear.monthName);
    const year = monthOfYear.year;
    
    const parsed = dateFns.parse(`${monthText} ${year}`, 'MMMM yyyy', new Date());
    if (!dateFns.isValid(parsed)) 
        throw new Error('Invalid month/year');
    
    return parsed;

}

function adjustCasing(str) {
    const allLower = String(str).toLowerCase();
    if (!allLower) 
        return '';
    return allLower.charAt(0).toUpperCase() + allLower.slice(1);
}
