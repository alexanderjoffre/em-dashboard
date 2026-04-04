import { Author } from "./Author";

export class ReviewNode {
    private state: string;
    private submittedAt?: string;
    private author: Author;

    constructor(state: string, submittedAt: string, author: Author) {
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

    public getAuthor(): Author {
        return this.author;
    }
}