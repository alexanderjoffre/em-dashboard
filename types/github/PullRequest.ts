import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Author } from "./Author";
import { Comments } from "./Comments";
import { Commits } from "./Commits";
import { PullRequestSize } from "./PullResquestSize";
import { Reviews } from "./Reviews";

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
    private statusCheckRollup: { state: string } | null;
    private age: number;

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
        statusCheckRollup: { state: string } | null;
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

    public getSize(): string {
        const size = this.additions + this.deletions;

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

    public getChangedFiles(): number {
        return this.changedFiles;
    }

    public getCommits(): Commits {
        return this.commits;
    }

    public getReviews(): Reviews {
        return this.reviews;
    }

    public getComments(): Comments {
        return this.comments;
    }

    public getStatusCheckRollup(): { state: string } | null {
        return this.statusCheckRollup;
    }

    public getAge(): number {
        return this.age;
    }
}