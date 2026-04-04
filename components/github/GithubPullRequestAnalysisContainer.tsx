"use client";

import { useGithubOpenPullRequests } from "@/hooks/api/useGithubOpenPullRequests";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { OpenPullRequestByAge } from "./charts/OpenPullRequestByAge";
import { OpenPullRequestCount } from "./charts/OpenPullRequestCount";

export const GithubPullRequestAnalysisContainer = () => {
    return (
        <Suspense fallback={<Loading />}>
            <GithubOpenPullRequestListContent />
        </Suspense>
    );
}

const GithubOpenPullRequestListContent = () => {
    const {
        data: githubOpenPullRequests,
        error
    } = useGithubOpenPullRequests();

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-2">
                <OpenPullRequestCount data={githubOpenPullRequests} />
            </div>
            <div className="col-span-2">
                <OpenPullRequestCount data={githubOpenPullRequests} />
            </div>
            <div className="col-span-2">
                <OpenPullRequestCount data={githubOpenPullRequests} />
            </div>
            <div className="col-span-2">
                <OpenPullRequestCount data={githubOpenPullRequests} />
            </div>
            <div className="col-span-2">
                <OpenPullRequestCount data={githubOpenPullRequests} />
            </div>
            <div className="col-span-2">
                <OpenPullRequestCount data={githubOpenPullRequests} />
            </div>

            <div className="col-span-4">
                <OpenPullRequestByAge data={githubOpenPullRequests} />
            </div>
            <pre className="col-span-12">
                {JSON.stringify(githubOpenPullRequests, null, 2)}
            </pre>
        </div>
    );
}

const Loading = () => {
    return (
        <Skeleton className="h-20 w-full" />
    );
}