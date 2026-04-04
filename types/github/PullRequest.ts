import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Author } from "./Author";
import { Comments } from "./Comments";
import { Commits } from "./Commits";
import { PullRequestSize } from "./PullResquestSize";
import { Reviews } from "./Reviews";
import { GithubStatusCheckState } from "./PullRequestStatusCheckState";

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

export class PullRequest {
    private id: string;
    private title: string;
    private state: string;
    private url: string;
    private createdAt: string;
    private updatedAt: string;
    private closedAt: string | null;
    private mergedAt: string | null;
    private author: Author;
    private additions: number;
    private deletions: number;
    private changedFiles: number;
    private commits: Commits;
    private reviews: Reviews;
    private comments: Comments
    private statusCheckRollup: { state: GithubStatusCheckState } | null;
    private age: number;
    private timeToFirstReviewMin: number | null;
    private jiraTicket: string | null;

    constructor(data: {
        id: string;
        title: string;
        state: string;
        url: string;
        createdAt: string;
        updatedAt: string;
        closedAt: string | null;
        mergedAt: string | null;
        author: Author;
        additions: number;
        deletions: number;
        changedFiles: number;
        commits: Commits;
        reviews: Reviews;
        comments: Comments;
        statusCheckRollup: { state: GithubStatusCheckState } | null;
    }) {
        this.id = data.id;
        this.title = data.title;
        this.state = data.state;
        this.url = data.url;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.closedAt = data.closedAt;
        this.mergedAt = data.mergedAt;
        this.author = data.author;
        this.additions = data.additions;
        this.deletions = data.deletions;
        this.changedFiles = data.changedFiles;
        this.commits = data.commits;
        this.reviews = data.reviews;
        this.comments = data.comments;
        this.statusCheckRollup = data.statusCheckRollup;
        this.age = this.calculateAge();
        this.timeToFirstReviewMin = this.calculateTimeToFirstReviewMin();
        this.jiraTicket = this.extractJiraTicket(this.title);
    }

    /** ========================================================== */
    /** Analytic Functions                                         */
    /** ========================================================== */

    // calculate business days between pull request creation date and today
    private calculateAge(): number {
        const today = dayjs.utc().startOf("day");
        const createdAt = dayjs.utc(this.createdAt).startOf("day");

        let daysCount = 0;
        let current = createdAt.clone();

        while (current.isSameOrBefore(today)) {
            const day = current.day();

            if (day !== 0 && day !== 6) {
                daysCount++;
            }

            current = current.add(1, "day");
        }

        return Math.max(daysCount - 1, 0);
    }

    private calculateTimeToFirstReviewMin(): number | null {
        if (!this.reviews || this.reviews.getTotalCount() === 0) {
            return null;
        }

        const nodes = this.reviews.getNodes();
        if (!nodes || nodes.length === 0) {
            return null;
        }

        const validReviews = nodes.filter(r => r.getSubmittedAt());
        if (validReviews.length === 0) {
            return null;
        }

        const sortedReviews = validReviews.sort((a, b) => {
            return dayjs.utc(a.getSubmittedAt()!).diff(dayjs.utc(b.getSubmittedAt()!));
        });

        const firstReview = sortedReviews[0];
        const createdAt = dayjs.utc(this.createdAt);
        const firstReviewAt = dayjs.utc(firstReview.getSubmittedAt()!);

        return firstReviewAt.diff(createdAt, 'minute');
    }

    private extractJiraTicket(title: string): string | null {
        const match = title.match(/\[([a-zA-Z]{2,6}-[1-9]\d*)\]/);
        return match ? match[1] : null;
    }

    public getSize(sizeToEvaluate?: number): PullRequestSize {
        const size = sizeToEvaluate ?? this.getChangedLines();

        if (size < 200) {
            return PullRequestSize.SMALL;
        } else if (size < 500) {
            return PullRequestSize.MEDIUM;
        } else if (size < 1000) {
            return PullRequestSize.LARGE;
        } else {
            return PullRequestSize.EXTRA_LARGE;
        }
    }


    /** ========================================================== */
    /** Getters                                                    */
    /** ========================================================== */
    public getId(): string {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

    public getState(): string {
        return this.state;
    }

    public getUrl(): string {
        return this.url;
    }

    public getCreatedAt(): string {
        return this.createdAt;
    }

    public getUpdatedAt(): string {
        return this.updatedAt;
    }

    public getClosedAt(): string | null {
        return this.closedAt;
    }

    public getMergedAt(): string | null {
        return this.mergedAt;
    }

    public getAuthor(): Author {
        return this.author;
    }

    public getAdditions(): number {
        return this.additions;
    }

    public getDeletions(): number {
        return this.deletions;
    }

    public getChangedLines(): number {
        return this.additions + this.deletions;
    }

    public getChangedFiles(): number {
        return this.changedFiles;
    }

    public getCommits(): Commits {
        return this.commits;
    }

    public hasReviews(): boolean {
        return this.reviews.getTotalCount() > 0 && this.reviews.getNodes().length > 0;
    }

    public getReviews(): Reviews {
        return this.reviews;
    }

    public getComments(): Comments {
        return this.comments;
    }

    public getStatusCheckRollup(): GithubStatusCheckState | null {
        return this.statusCheckRollup?.state ?? null;
    }

    public isBlocked(): boolean {
        return this.getStatusCheckRollup() === GithubStatusCheckState.FAILURE;
    }

    public getAge(): number {
        return this.age;
    }

    public getTimeToFirstReviewMin(): number | null {
        return this.timeToFirstReviewMin;
    }

    public getJiraTicket(): string | null {
        return this.jiraTicket;
    }

    public getJiraTicketUrl(): string | null {
        if (!this.jiraTicket) {
            return null;
        }
        return `https://${process.env.NEXT_PUBLIC_JIRA_ACCOUNT_NAME}.atlassian.net/browse/${this.jiraTicket}`;
    }

    public hasJiraTicket(): boolean {
        return this.jiraTicket !== null;
    }
}