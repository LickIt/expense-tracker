export class Expense {
    constructor(
        public id?: number,
        public amount?: number,
        public timestamp?: Date,
        public userid?: number,
        public categoryid?: number,
        public notes?: string,
    ) { }
}

export class ExpenseCategoryReport {
    constructor(
        public categoryid: number,
        public amount: number,
        public count: number
    ) { }
}

class ExpenseCategoryGroup {
    constructor(
        public categoryid: number,
        public value: number
    ) { }
}

export class ExpenseDailyReport {
    constructor(
        public mean: number,
        public median: number,
        public top3CatAmount: ExpenseCategoryGroup[],
        public top3CatCount: ExpenseCategoryGroup[]
    ) { }
}

class ExpenseMonthGroup {
    constructor(
        public month: number,
        public value: number
    ) { }
}

export class ExpenseMonthlyReport {
    constructor(
        public thisMonthTotal: number,
        public last5Months: ExpenseMonthGroup[]
    ) { }
}
