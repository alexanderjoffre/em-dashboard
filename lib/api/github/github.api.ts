import { Repository } from "@/types/github/Repository";
import { GET_REPOSITORIES_GRAPHQL_QUERY } from "./queries/getRepositories";
import { PullRequest } from "@/types/github/PullRequest";
import { GithubUser } from "@/types/github/GithubUser";
import { ReviewNode } from "@/types/github/ReviewNode";
import { Commits } from "@/types/github/Commits";
import { Comments } from "@/types/github/Comments";
import { Reviews } from "@/types/github/Reviews";
import repositoriesMock from "./mock/repository.mock.json";

const GITHUB_API_URL = "https://api.github.com/graphql";
const REPOSITORY_OWNER = process.env.GH_REPOSITORIES_OWNER || "";
const flagUseMock = true;

export const getAllGithubOpenPullRequests = async (): Promise<Repository[]> => {
    let data;

    if (flagUseMock) {
        data = repositoriesMock;
    } else {
        const repositories = process.env.GH_REPOSITORIES_TO_ANALYZE?.split(',').map(r => r.trim()) || [];
        const responses = await Promise.all(
            repositories.map(repositoryName =>
                githubFetch(GET_REPOSITORIES_GRAPHQL_QUERY, {
                    owner: REPOSITORY_OWNER,
                    name: repositoryName,
                    cursor: null,
                })
            )
        );
        data = responses.filter(r => r && r.repository).map(r => r.repository);

        try {
            const fs = require('fs');
            const path = require('path');
            const mockPath = path.join(process.cwd(), 'lib/api/github/mock/repository.mock.json');
            fs.writeFileSync(mockPath, JSON.stringify(data, null, 4), 'utf-8');
            console.log("Mock actualizado satisfactoriamente ✨");
        } catch (err) {
            console.error("No se pudo escribir el archivo mock", err);
        }
    }

    const repositoriesData: Repository[] = data.map((repo: any) => {
        const prList: any[] = Array.isArray(repo.pullRequests)
            ? repo.pullRequests
            : (repo.pullRequests.nodes || []);

        return new Repository(
            repo.name,
            prList.map((pr: any) => new PullRequest({
                id: pr.id,
                title: pr.title,
                state: pr.state,
                url: pr.url,
                createdAt: pr.createdAt,
                updatedAt: pr.updatedAt,
                closedAt: pr.closedAt,
                mergedAt: pr.mergedAt,
                author: new GithubUser(pr.author.login, pr.author.avatarUrl),
                targetBranchName: pr.baseRefName,
                sourceBranchName: pr.headRefName,
                additions: pr.additions,
                deletions: pr.deletions,
                changedFiles: pr.changedFiles,
                commits: new Commits(pr.commits.totalCount),
                reviews: new Reviews(
                    pr.reviews.totalCount,
                    pr.reviews.nodes.map((review: any) => new ReviewNode(
                        review.state,
                        review.submittedAt,
                        new GithubUser(review.author.login, review.author.avatarUrl)
                    ))
                ),
                comments: new Comments(pr.comments.totalCount),
                statusCheckRollup: pr.statusCheckRollup,
            }))
        );
    });

    return repositoriesData;
}

async function githubFetch(query: string, variables?: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 3000));
    const res = await fetch(GITHUB_API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.GH_PERSONAL_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query,
            variables,
        }),
        // importante en Next.js
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status}`);
    }

    const json = await res.json();

    if (json.errors) {
        console.error(json.errors);
        throw new Error("GraphQL error");
    }

    return json.data;
}