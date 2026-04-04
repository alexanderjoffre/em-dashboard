"use client";

import { useGithubPullRequests } from "@/hooks/api/useGithubOpenPullRequests";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { OpenPullRequestByAge } from "./charts/OpenPullRequestByAge";
import { OpenPullRequestCount } from "./charts/OpenPullRequestCount";
import { MatrixPRSizeVsTTFR } from "./charts/MatrixPRSizeVsTTFR";
import { NotReviewedPullRequestCount } from "./charts/NotReviewedPullRequestCount";
import { BlockedPullRequestCount } from "./charts/BlockedPullRequestCount";
import { P50TimeToFirstReview } from "./charts/P50TimeToFirstReview";
import { MostCommonPRSize } from "./charts/MostCommonPRSize";
import { PullReuqestWithoutTicketCount } from "./charts/PullReuqestWithoutTicketCount";

export const GithubPullRequestAnalysisContainer = () => {
    return (
        <Suspense fallback={<Loading />}>
            <GithubPullRequestListContent />
        </Suspense>
    );
}

const GithubPullRequestListContent = () => {
    const {
        data: githubPullRequests,
        error
    } = useGithubPullRequests();

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-2">
                <OpenPullRequestCount data={githubPullRequests} />
            </div>
            <div className="col-span-2">
                <NotReviewedPullRequestCount data={githubPullRequests} />
            </div>
            <div className="col-span-2">
                <BlockedPullRequestCount data={githubPullRequests} />
            </div>
            <div className="col-span-2">
                <P50TimeToFirstReview data={githubPullRequests} />
            </div>
            <div className="col-span-2">
                <MostCommonPRSize data={githubPullRequests} />
            </div>
            <div className="col-span-2">
                <PullReuqestWithoutTicketCount data={githubPullRequests} />
            </div>

            <div className="col-span-4">
                <OpenPullRequestByAge data={githubPullRequests} />
            </div>
            <div className="col-span-8">
                <MatrixPRSizeVsTTFR data={githubPullRequests} />
            </div>
            {/* <pre className="col-span-12">
                {JSON.stringify(githubPullRequests, null, 2)}
            </pre> */}
        </div>
    );
}

const Loading = () => {
    return (
        <Skeleton className="h-20 w-full" />
    );
}