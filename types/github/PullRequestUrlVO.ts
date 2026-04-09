export class PullRequestUrlVO {
    private readonly url: string;

    constructor(url: string | { url: string }) {
        if (!url) {
            throw new Error("Url is required");
        }

        this.url = typeof url === "string" ? url : url.url;
    }

    public toString(): string {
        return this.url;
    }

    public getRepositoryName(): string {
        const urlParts = this.url.split("/");

        return urlParts[4];
    }

    public getPullRequestNumber(): string {
        const urlParts = this.url.split("/");
        return urlParts[6];
    }
}