import { Repository } from "@/types/github/Repository";
import { GET_REPOSITORIES_GRAPHQL_QUERY } from "./queries/getRepositories";
import { PullRequest } from "@/types/github/PullRequest";
import { Author } from "@/types/github/Author";
import { ReviewNode } from "@/types/github/ReviewNode";
import { Commits } from "@/types/github/Commits";
import { Comments } from "@/types/github/Comments";
import { Reviews } from "@/types/github/Reviews";
import repositoryMock from "./mock/repository.mock.json";

const GITHUB_API_URL = "https://api.github.com/graphql";
const REPOSITORY_OWNER = process.env.GH_REPOSITORIES_OWNER || "";
const flagUseMock = true;

export const getAllGithubOpenPullRequests = async (
    repositoryName: string
): Promise<Repository[]> => {
    let data;

    if (flagUseMock) {
        data = repositoryMock;
    } else {
        const response = await githubFetch(GET_REPOSITORIES_GRAPHQL_QUERY, {
            owner: REPOSITORY_OWNER,
            name: repositoryName,
            cursor: null,
        });
        data = response.repository;
    }

    const repositoryData: Repository = new Repository(
        data.name,
        data.pullRequests.map((pr: any) => new PullRequest({
            id: pr.id,
            title: pr.title,
            state: pr.state,
            url: pr.url,
            createdAt: pr.createdAt,
            updatedAt: pr.updatedAt,
            closedAt: pr.closedAt,
            mergedAt: pr.mergedAt,
            author: new Author(pr.author.login, pr.author.avatarUrl),
            additions: pr.additions,
            deletions: pr.deletions,
            changedFiles: pr.changedFiles,
            commits: new Commits(pr.commits.totalCount),
            reviews: new Reviews(
                pr.reviews.totalCount,
                pr.reviews.nodes.map((review: any) => new ReviewNode(
                    review.state,
                    review.submittedAt,
                    new Author(review.author.login, review.author.avatarUrl)
                ))
            ),
            comments: new Comments(pr.comments.totalCount),
            statusCheckRollup: pr.statusCheckRollup,
        }))
    )

    return [repositoryData];
}

export async function githubFetch(query: string, variables?: any): Promise<any> {
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