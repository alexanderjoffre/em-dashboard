"use client";

import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { PullRequest } from "@/types/github/PullRequest";
import { PullRequestSize } from "@/types/github/PullResquestSize";
import { Repository } from "@/types/github/Repository";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

interface OpenPullRequestByAgeProps {
    data: Repository[];
}

interface flatDataRecord {
    age: number;
    size: string;
}

const colors = {
    zeroToOne: "#01e274",
    twoToThree: "#e2b101",
    fourToSeven: "#e26e01",
    moreThanSeven: "#e21801",
}

export const OpenPullRequestByAge = ({ data }: OpenPullRequestByAgeProps) => {
    const flatData = data.reduce((list: flatDataRecord[], repo: Repository) => {
        const pullRequests = repo.getOpenPullRequests()
            .map((pr: PullRequest) => ({
                age: pr.getAge(),
                size: pr.getSize()
            }));

        return [...list, ...pullRequests];
    }, []);

    const getPullRequestsBreakdownByCondition = (
        pullRequests: flatDataRecord[],
        condition: (pr: flatDataRecord) => boolean
    ) => {
        const prList = pullRequests.filter(condition);

        return {
            count: prList.length,
            breakdown: {
                small: prList.filter((pr) => pr.size === PullRequestSize.SMALL).length,
                medium: prList.filter((pr) => pr.size === PullRequestSize.MEDIUM).length,
                large: prList.filter((pr) => pr.size === PullRequestSize.LARGE).length,
                extraLarge: prList.filter((pr) => pr.size === PullRequestSize.EXTRA_LARGE).length,
            }
        }
    }

    const chartData = [
        {
            age: "1 day", fill: colors.zeroToOne,
            ...getPullRequestsBreakdownByCondition(flatData, (pr) => pr.age === 1),
        },
        {
            age: "2 days", fill: colors.twoToThree,
            ...getPullRequestsBreakdownByCondition(flatData, (pr) => pr.age === 2),
        },
        {
            age: "3 days", fill: colors.twoToThree,
            ...getPullRequestsBreakdownByCondition(flatData, (pr) => pr.age === 3),
        },
        {
            age: "4 days", fill: colors.fourToSeven,
            ...getPullRequestsBreakdownByCondition(flatData, (pr) => pr.age === 4),
        },
        {
            age: "5 days", fill: colors.fourToSeven,
            ...getPullRequestsBreakdownByCondition(flatData, (pr) => pr.age === 5),
        },
        {
            age: "6 days", fill: colors.fourToSeven,
            ...getPullRequestsBreakdownByCondition(flatData, (pr) => pr.age === 6),
        },
        {
            age: "7 days", fill: colors.fourToSeven,
            ...getPullRequestsBreakdownByCondition(flatData, (pr) => pr.age === 7),
        },
        {
            age: "+7 days", fill: colors.moreThanSeven,
            ...getPullRequestsBreakdownByCondition(flatData, (pr) => pr.age > 7)
        },
    ];

    const chartConfig = {} satisfies ChartConfig

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2 justify-between">
                    <CardTitle className="text-2xl">Pull Request by Age</CardTitle>
                    <MetricTooltip />
                </div>
                <CardDescription>
                    <MetricLegends />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} >
                    <BarChart accessibilityLayer data={chartData}>
                        <XAxis
                            dataKey="age"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.toString()}
                        />
                        <YAxis
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            allowDecimals={false}
                            tickFormatter={(value) => value.toString()}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartCustomTooltipContent />}
                        />
                        <Bar dataKey="count" radius={8} />
                    </BarChart>
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
                    {data.age} ago: {data.count} PR
                </h4>
            </div>
            <div>
                <ul className="flex flex-col gap-2 font-bold">
                    <li className="flex justify-between gap-4">
                        <strong>Small:</strong> {data.breakdown.small}
                    </li>
                    <li className="flex justify-between gap-4">
                        <strong>Medium:</strong> {data.breakdown.medium}
                    </li>
                    <li className="flex justify-between gap-4">
                        <strong>Large:</strong> {data.breakdown.large}
                    </li>
                    <li className="flex justify-between gap-4">
                        <strong>Extra Large:</strong> {data.breakdown.extraLarge}
                    </li>
                </ul>
            </div>
        </div>
    )
}

const MetricTooltip = () => {
    return (
        <InfoTooltip>
            <p className="mb-4 font-extrabold">
                This chart shows the distribution of open pull requests classified by their age in business days excluding saturday and sunday.
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
        <div className="flex py-4 justify-end">
            <div className="flex gap-8">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: colors.zeroToOne }}></span>
                    <span className="text-sm">0-1 day</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: colors.twoToThree }}></span>
                    <span className="text-sm">2-3 days</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: colors.fourToSeven }}></span>
                    <span className="text-sm">4-7 days</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: colors.moreThanSeven }}></span>
                    <span className="text-sm">+7 days</span>
                </div>
            </div>
        </div>
    )
}

const MetricHealth = ({ data }: { data: flatDataRecord[] }) => {
    const total = data.length;
    const percentageOlderThanThreeDays = (data.filter((pr) => pr.age > 3).length / total) * 100;

    const HealthyStatusCard = () => (
        <div className="flex items-center gap-4 p-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div className="grid gap-1">
                <span className="text-md">The PRs are reviewed on time. Congrats!</span>
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
                <span className="text-md">{percentage.toFixed(1)}% of the PRs have been open for more than 3 days</span>
                <span className="text-md text-slate-400">
                    Make sure a PR is reviewed within the first 24 hours to avoid delays.
                </span>
            </div>
        </div>
    )

    const ProblemStatusCard = ({ percentage }: { percentage: number }) => (
        <div className="flex items-center gap-4 p-4 bg-amber-700 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-slate-300" />
            <div className="grid gap-1">
                <span className="text-md">{percentage.toFixed(1)}% of the PRs have been open for more than 3 days</span>
                <span className="text-md text-slate-200">
                    Consider prioritizing older pull requests before starting new work.
                </span>
            </div>
        </div>
    )

    const CriticalStatusCard = ({ percentage }: { percentage: number }) => (
        <div className="flex items-center gap-4 p-4 bg-red-800 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-slate-300" />
            <div className="grid gap-1">
                <span className="text-md">{percentage.toFixed(1)}% of the PRs are at risk of being stale</span>
                <span className="text-md text-slate-200">
                    Identify why PRs are blocked and take action to resolve them.
                </span>
            </div>
        </div>
    )

    if (percentageOlderThanThreeDays < 20) {
        return <HealthyStatusCard />
    }

    if (percentageOlderThanThreeDays < 40) {
        return <FrictionStatusCard percentage={percentageOlderThanThreeDays} />
    }

    if (percentageOlderThanThreeDays < 60) {
        return <ProblemStatusCard percentage={percentageOlderThanThreeDays} />
    }

    return <CriticalStatusCard percentage={percentageOlderThanThreeDays} />
}