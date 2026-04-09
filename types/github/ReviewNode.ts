import { GithubUser } from "./GithubUser";

export class ReviewNode {
    private state: string;
    private submittedAt?: string;
    private author: GithubUser;

    constructor(state: string, submittedAt: string, author: GithubUser) {
        this.state = state;
        this.submittedAt = submittedAt;
        this.author = author;
    }

    public getState(): string {
        return this.state;
    }

    public getSubmittedAt(): string | undefined {
        return this.submittedAt;
    }

    public getAuthor(): GithubUser {
        return this.author;
    }
}