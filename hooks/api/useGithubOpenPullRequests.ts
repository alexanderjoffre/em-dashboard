import { useSuspenseQuery } from "@tanstack/react-query";
import { Repository } from "@/types/github/Repository";
import { PullRequest } from "@/types/github/PullRequest";
import { Author } from "@/types/github/Author";
import { Commits } from "@/types/github/Commits";
import { Reviews } from "@/types/github/Reviews";
import { ReviewNode } from "@/types/github/ReviewNode";
import { Comments } from "@/types/github/Comments";

const getBaseUrl = () => {
    if (typeof window !== "undefined") return "";
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const useGithubOpenPullRequests = () => {
    return useSuspenseQuery({
        queryKey: ["github-open-pull-requests"],
        queryFn: async (): Promise<Repository[]> => {
            const res = await fetch(`${getBaseUrl()}/api/github/pull-requests?repository=ema`);
            if (!res.ok) {
                throw new Error("Failed to fetch pull requests");
            }
            const data = await res.json();

            return data.map((repo: any) => {
                const combinedPRs = [...(repo.openPullRequests || []), ...(repo.mergedPullRequests || [])];
                return new Repository(
                    repo.name,
                    combinedPRs.map((pr: any) => new PullRequest({
                        id: pr.id,
                        title: pr.title,
                        state: pr.state,
                        url: pr.url,
                        createdAt: pr.createdAt,
                        updatedAt: pr.updatedAt,
                        closedAt: pr.closedAt,
                        mergedAt: pr.mergedAt,
                        author: new Author(pr.author?.login, pr.author?.avatarUrl),
                        additions: pr.additions,
                        deletions: pr.deletions,
                        changedFiles: pr.changedFiles,
                        commits: new Commits(pr.commits?.totalCount || 0),
                        reviews: new Reviews(
                            pr.reviews?.totalCount || 0,
                            pr.reviews?.nodes ? pr.reviews.nodes.map((review: any) => new ReviewNode(
                                review.state,
                                review.submittedAt,
                                new Author(review.author?.login, review.author?.avatarUrl)
                            )) : []
                        ),
                        comments: new Comments(pr.comments?.totalCount || 0),
                        statusCheckRollup: pr.statusCheckRollup,
                    }))
                );
            });
        },
    })
}