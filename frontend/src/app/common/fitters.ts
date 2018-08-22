/**
 * Calculate trend with linear equation.
 */
export class LinearFitter {
    public count = 0;
    private sumX = 0;
    private sumX2 = 0;
    private sumXY = 0;
    private sumY = 0;

    public add(x: number, y: number) {
        this.count++;
        this.sumX += x;
        this.sumX2 += x * x;
        this.sumXY += x * y;
        this.sumY += y;
    }

    public project(...x: number[]): number[] {
        const det = this.count * this.sumX2 - this.sumX * this.sumX;
        const offset = (this.sumX2 * this.sumY - this.sumX * this.sumXY) / det;
        const scale = (this.count * this.sumXY - this.sumX * this.sumY) / det;

        return x.map(_x => offset + _x * scale);
    }
}

/**
 * Calculate trend with square equation.
 */
export class SquareFitter {
    public count = 0;
    private sumX = 0;
    private sumX2 = 0;
    private sumX3 = 0;
    private sumX4 = 0;
    private sumY = 0;
    private sumXY = 0;
    private sumX2Y = 0;

    public add(x: number, y: number) {
        this.count++;
        this.sumX += x;
        this.sumX2 += x * x;
        this.sumX3 += x * x * x;
        this.sumX4 += x * x * x * x;
        this.sumY += y;
        this.sumXY += x * y;
        this.sumX2Y += x * x * y;
    }

    public project(...x: number[]): number[] {
        const det = this.count * this.sumX2 * this.sumX4
            - this.count * this.sumX3 * this.sumX3
            - this.sumX * this.sumX * this.sumX4
            + 2 * this.sumX * this.sumX2 * this.sumX3
            - this.sumX2 * this.sumX2 * this.sumX2;
        const offset = this.sumX * this.sumX2Y * this.sumX3
            - this.sumX * this.sumX4 * this.sumXY
            - this.sumX2 * this.sumX2 * this.sumX2Y
            + this.sumX2 * this.sumX3 * this.sumXY
            + this.sumX2 * this.sumX4 * this.sumY
            - this.sumX3 * this.sumX3 * this.sumY;
        const scale = -this.count * this.sumX2Y * this.sumX3
            + this.count * this.sumX4 * this.sumXY
            + this.sumX * this.sumX2 * this.sumX2Y
            - this.sumX * this.sumX4 * this.sumY
            - this.sumX2 * this.sumX2 * this.sumXY
            + this.sumX2 * this.sumX3 * this.sumY;
        const accel = this.sumY * this.sumX * this.sumX3
            - this.sumY * this.sumX2 * this.sumX2
            - this.sumXY * this.count * this.sumX3
            + this.sumXY * this.sumX2 * this.sumX
            - this.sumX2Y * this.sumX * this.sumX
            + this.sumX2Y * this.count * this.sumX2;

        return x.map(_x => (offset + _x * scale + _x * _x * accel) / det);
    }
}
