export class Comments {
    private totalCount: number;

    constructor(totalCount: number) {
        this.totalCount = totalCount;
    }

    public getTotalCount(): number {
        return this.totalCount;
    }
}