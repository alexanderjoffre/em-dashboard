export class Author {
    private login: string;
    private avatarUrl: string;

    constructor(login: string, avatarUrl?: string) {
        this.login = login;
        this.avatarUrl = avatarUrl ?? "";
    }

    public getLogin(): string {
        return this.login;
    }

    public getAvatarUrl(): string {
        return this.avatarUrl;
    }
}