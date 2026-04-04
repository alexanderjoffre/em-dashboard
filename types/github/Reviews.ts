import { ReviewNode } from "./ReviewNode";

export class Reviews {
    private totalCount: number;
    private nodes: ReviewNode[];

    constructor(totalCount: number, nodes: ReviewNode[]) {
        this.totalCount = totalCount;
        this.nodes = nodes;
    }

    public getTotalCount(): number {
        return this.totalCount;
    }

    public getNodes(): ReviewNode[] {
        return this.nodes;
    }
}