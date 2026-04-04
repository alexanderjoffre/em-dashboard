import { PullRequest } from "./PullRequest";
import { PullRequestState } from "./PullRequestState";

export class Repository {
    private name: string;
    private openPullRequests: PullRequest[];
    private mergedPullRequests: PullRequest[];

    constructor(name: string, pullRequests: PullRequest[]) {
        this.name = name;
        this.openPullRequests = pullRequests.filter((pr) => pr.getState() === PullRequestState.OPEN);
        this.mergedPullRequests = pullRequests.filter((pr) => pr.getState() === PullRequestState.MERGED);
    }

    public getName(): string {
        return this.name;
    }

    public getOpenPullRequests(): PullRequest[] {
        return this.openPullRequests;
    }

    public getMergedPullRequests(): PullRequest[] {
        return this.mergedPullRequests;
    }

    public getOpenPullRequestCount(): number {
        return this.openPullRequests.length;
    }
}