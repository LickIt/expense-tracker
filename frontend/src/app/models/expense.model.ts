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
