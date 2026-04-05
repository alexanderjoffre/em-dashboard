"use client";

import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { PullRequest } from "@/types/github/PullRequest";
import { PullRequestSize } from "@/types/github/PullResquestSize";
import { Repository } from "@/types/github/Repository";
import { AlertTriangle, CheckCircle } from "lucide-react";
import React from "react";
import { Label, Pie, PieChart } from "recharts";

interface PullRequestBySizeProps {
    data: Repository[];
}

const colors = {
    [PullRequestSize.SMALL]: "oklch(62.7% 0.194 149.214)",    // bg-green-600
    [PullRequestSize.MEDIUM]: "oklch(82.8% 0.189 84.429)",    // bg-amber-400
    [PullRequestSize.LARGE]: "oklch(47.3% 0.137 46.201)",   // bg-amber-700
    [PullRequestSize.EXTRA_LARGE]: "oklch(50.5% 0.213 27.518)", // bg-red-800
}

export const PullRequestBySize = ({ data }: PullRequestBySizeProps) => {
    const flatData = data.reduce((list: PullRequestSize[], repo: Repository) => {
        const pullRequestsSizes = repo.getOpenPullRequests().concat(repo.getMergedPullRequests())
            .map((pr: PullRequest) => pr.getSize());

        return [...list, ...pullRequestsSizes];
    }, []);

    const totalPR = React.useMemo(() => flatData.length, [])

    const chartData = [
        {
            size: PullRequestSize.SMALL,
            count: flatData.filter((size) => size === PullRequestSize.SMALL).length,
            fill: colors[PullRequestSize.SMALL],
        },
        {
            size: PullRequestSize.MEDIUM,
            count: flatData.filter((size) => size === PullRequestSize.MEDIUM).length,
            fill: colors[PullRequestSize.MEDIUM],
        },
        {
            size: PullRequestSize.LARGE,
            count: flatData.filter((size) => size === PullRequestSize.LARGE).length,
            fill: colors[PullRequestSize.LARGE],
        },
        {
            size: PullRequestSize.EXTRA_LARGE,
            count: flatData.filter((size) => size === PullRequestSize.EXTRA_LARGE).length,
            fill: colors[PullRequestSize.EXTRA_LARGE],
        },
    ];

    const chartConfig = {} satisfies ChartConfig

    return (
        <Card className="min-h-full flex flex-col justify-between">
            <CardHeader>
                <div className="flex items-center gap-2 justify-between">
                    <CardTitle className="text-2xl">Pull Request by Size</CardTitle>
                    <MetricTooltip />
                </div>
                <CardDescription>
                    <MetricLegends />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartCustomTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="size"
                            innerRadius={80}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalPR.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Pull Requests
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="grid w-full">
                    <MetricHealth data={flatData} />
                </div>
            </CardFooter>
        </Card>
    );
}

const ChartCustomTooltipContent = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
        <div className="text-slate-300 bg-mist-900 p-4 rounded-md">
            <div className="flex items-center gap-2 mb-2 border-b border-slate-400 pb-2">
                <span style={{
                    backgroundColor: data.fill,
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%"
                }}></span>

                <h4 className="text-sm font-extrabold">
                    {data.size}: {data.count} PR
                </h4>
            </div>
        </div>
    )
}

const MetricTooltip = () => {
    return (
        <InfoTooltip>
            <p className="mb-4 font-extrabold">
                This chart shows the distribution of all analyzed pull requests classified by their size.
            </p>
            <p className="mb-2 font-extrabold">
                The breakdown by size is as follows:
            </p>
            <ul className="flex flex-col gap-1">
                <li>
                    <strong className="font-extrabold">Small:</strong> less than 200 lines of code
                </li>
                <li>
                    <strong className="font-extrabold">Medium:</strong> between 200 and 500 lines of code
                </li>
                <li>
                    <strong className="font-extrabold">Large:</strong> between 500 and 1000 lines of code
                </li>
                <li>
                    <strong className="font-extrabold">Extra Large:</strong> more than 1000 lines of code
                </li>
            </ul>
        </InfoTooltip>
    );
}

const MetricLegends = () => {
    return (
        <div className="flex py-4">
            <div className="flex gap-8">
                <span className="font-extrabold text-lg">Lines of code: </span>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: colors[PullRequestSize.SMALL] }}></span>
                    <span className="text-sm">200</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: colors[PullRequestSize.MEDIUM] }}></span>
                    <span className="text-sm">500</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: colors[PullRequestSize.LARGE] }}></span>
                    <span className="text-sm">1000</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: colors[PullRequestSize.EXTRA_LARGE] }}></span>
                    <span className="text-sm">+1000</span>
                </div>
            </div>
        </div>
    )
}

const MetricHealth = ({ data }: { data: PullRequestSize[] }) => {
    const total = data.length;
    const percentageLargestPRs = (data.filter((size) =>
        [PullRequestSize.LARGE, PullRequestSize.EXTRA_LARGE].includes(size)
    ).length / total) * 100;

    const HealthyStatusCard = () => (
        <div className="flex items-center gap-4 p-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div className="grid gap-1">
                <span className="text-md">The PRs are small enough!</span>
                <span className="text-md text-slate-400">
                    Keep up the good work! No action is required.
                </span>
            </div>
        </div>
    )

    const FrictionStatusCard = ({ percentage }: { percentage: number }) => (
        <div className="flex items-center gap-4 p-4">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <div className="grid gap-1">
                <span className="text-md">{percentage.toFixed(1)}% of the PRs have more than 500 lines of code</span>
                <span className="text-md text-slate-400">
                    Try to keep PRs under 500 lines of code to get faster reviews.
                </span>
            </div>
        </div>
    )

    const ProblemStatusCard = ({ percentage }: { percentage: number }) => (
        <div className="flex items-center gap-4 p-4 bg-amber-700 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-slate-300" />
            <div className="grid gap-1">
                <span className="text-md">{percentage.toFixed(1)}% of the PRs have more than 500 lines of code</span>
                <span className="text-md text-slate-200">
                    Consider splitting large PRs into smaller ones related to sub-tasks to get faster reviews.
                </span>
            </div>
        </div>
    )

    const CriticalStatusCard = ({ percentage }: { percentage: number }) => (
        <div className="flex items-center gap-4 p-4 bg-red-800 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-slate-300" />
            <div className="grid gap-1">
                <span className="text-md">{percentage.toFixed(1)}% of the PRs have more than 500 lines of code</span>
                <span className="text-md text-slate-200">
                    Consider planning your work in smaller tasks to avoid large PRs.
                </span>
            </div>
        </div>
    )

    if (percentageLargestPRs < 20) {
        return <HealthyStatusCard />
    }

    if (percentageLargestPRs < 40) {
        return <FrictionStatusCard percentage={percentageLargestPRs} />
    }

    if (percentageLargestPRs < 60) {
        return <ProblemStatusCard percentage={percentageLargestPRs} />
    }

    return <CriticalStatusCard percentage={percentageLargestPRs} />
}