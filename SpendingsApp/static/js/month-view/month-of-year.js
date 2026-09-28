

export class MonthOfYear {
    constructor(monthName, year) {
        if (typeof monthName !== "string")
            throw new TypeError("monthName must be a string");
        
        if (!Number.isInteger(year)) 
            throw new TypeError("year must be an integer");

        this.monthName = monthName;
        this.year = year;
    }
}