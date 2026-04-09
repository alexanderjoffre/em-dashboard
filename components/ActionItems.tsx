"use client";

import { useGithubPullRequests } from "@/hooks/api/useGithubOpenPullRequests";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";
import { GHIssuesFounOnPR } from "./github/tables/GHIssuesFounOnPR";

export const ActionItems = () => {
    return (
        <Suspense fallback={<Loading />}>
            <ActionItemsContent />
        </Suspense>
    );
}

const ActionItemsContent = () => {
    const {
        data: githubPullRequests,
        error
    } = useGithubPullRequests();

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <GHIssuesFounOnPR data={githubPullRequests} />
        </div>
    );
}

const Loading = () => {
    return (
        <Skeleton className="h-20 w-full" />
    );
}