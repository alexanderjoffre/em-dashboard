"use client";

import { useGithubPullRequests } from "@/hooks/api/useGithubOpenPullRequests";
import { Suspense } from "react";
import { GHOpenPRCard } from "./github/cards/GHOpenPRCard";
import { GHNotReviewedPRCard } from "./github/cards/GHNotReviewedPRCard";
import { GHBlockedPRCard } from "./github/cards/GHBlockedPRCard";
import { GHP50TimeToFirstReviewCard } from "./github/cards/GHP50TimeToFirstReviewCard";
import { GHMostCommonPRSizeCard } from "./github/cards/GHMostCommonPRSizeCard";
import { GHPRWithoutTicket } from "./github/cards/GHPRWithoutTicket";
import { OpenPullRequestByAge } from "./github/charts/OpenPullRequestByAge";
import { PullRequestBySize } from "./github/charts/PullRequestBySize";
import { MatrixPRSizeVsTTFR } from "./github/charts/MatrixPRSizeVsTTFR";
import { Skeleton } from "./ui/skeleton";

export const Dashboard = () => {
    return (
        <Suspense fallback={<Loading />}>
            <DashboardContent />
        </Suspense>
    );
}

const DashboardContent = () => {
    const {
        data: githubPullRequests,
        error
    } = useGithubPullRequests();

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="grid grid-cols-12 gap-4 pt-4">
            <div className="col-span-2">
                <GHOpenPRCard data={githubPullRequests} />
            </div>
            <div className="col-span-2">
                <GHNotReviewedPRCard data={githubPullRequests} />
            </div>
            <div className="col-span-2">
                <GHBlockedPRCard data={githubPullRequests} />
            </div>
            <div className="col-span-2">
                <GHP50TimeToFirstReviewCard data={githubPullRequests} />
            </div>
            <div className="col-span-2">
                <GHMostCommonPRSizeCard data={githubPullRequests} />
            </div>
            <div className="col-span-2">
                <GHPRWithoutTicket data={githubPullRequests} />
            </div>

            <div className="col-span-4">
                <OpenPullRequestByAge data={githubPullRequests} />
            </div>
            <div className="col-span-4">
                <PullRequestBySize data={githubPullRequests} />
            </div>


            <div className="col-span-4">
                <MatrixPRSizeVsTTFR data={githubPullRequests} />
            </div>
        </div>
    );
}

const Loading = () => {
    return (
        <Skeleton className="h-20 w-full" />
    );
}