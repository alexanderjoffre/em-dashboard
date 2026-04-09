import githubUsersData from "@/lib/api/github/mock/githubUsers.mock.json";

export class GithubUser {
    private login: string;
    private avatarUrl: string;


    constructor(login: string, avatarUrl?: string) {
        this.login = login;
        this.avatarUrl = avatarUrl ?? "";
    }

    public getLogin(): string {
        return this.login.trim().toLowerCase();
    }

    public getName(): string {
        return (githubUsersData as any)[this.login]?.name ?? this.login;
    }

    public getAvatarUrl(): string {
        return this.avatarUrl;
    }

    public isInactive(): boolean {
        return (githubUsersData as any)[this.login]?.status === "inactive";
    }

    public getTitle(): string {
        return (githubUsersData as any)[this.login]?.title ?? "";
    }

    public getPod(): string {
        return (githubUsersData as any)[this.login]?.pod ?? "";
    }

    public getTeam(): string {
        return (githubUsersData as any)[this.login]?.team ?? "";
    }
}