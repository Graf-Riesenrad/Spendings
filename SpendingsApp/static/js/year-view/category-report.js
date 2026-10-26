

export class CategoryReport {
    constructor(category, monthlyTotals, monthlyAverage, yearlyTotal) {
        if (monthlyTotals.length !== 12)
            throw new Error(`Expected 12 monthly totals, got ${monthlyTotals.length}`);

        this.category = category;
        this.monthlyTotals = monthlyTotals;
        this.monthlyAverage = monthlyAverage;
        this.yearlyTotal = yearlyTotal;
    }
}