"use client";

import { useState } from "react";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Repository } from "@/types/github/Repository";
import { PullRequestSize } from "@/types/github/PullResquestSize";
interface MatrixPRSizeVsTTFRProps {
    data: Repository[];
}

type SizeStats = { p50: number, p90: number, count: number };
type PRSizeMatrix = Record<string, SizeStats>;

const formatTime = (minutes: number) => {
    const days = Number((minutes / 1440).toFixed(0));

    if (minutes < 60) return `${(minutes).toFixed(0)}m`; // less than an hour
    if (days < 1) return `${(minutes / 60).toFixed(0)}h`; // less than a day
    return `${Number(days.toFixed(1))}d`; // 1 day or more
};

export const MatrixPRSizeVsTTFR = ({ data }: MatrixPRSizeVsTTFRProps) => {
    const { matrix, maxReviewTime } = calculatePRSizeMatrix(data);

    const sizeLabels = [
        { key: PullRequestSize.SMALL, label: "Small" },
        { key: PullRequestSize.MEDIUM, label: "Medium" },
        { key: PullRequestSize.LARGE, label: "Large" },
        { key: PullRequestSize.EXTRA_LARGE, label: "Extra Large" },
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2 justify-between">
                    <CardTitle>
                        <h4 className="text-lg font-semibold">
                            PR size vs Time to First Review
                        </h4>
                    </CardTitle>
                    <MetricTooltip />
                </div>
                <CardDescription>
                    <MetricLegends />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-9 col-start-4">
                        <div className="flex items-center gap-2 justify-between">
                            <span className="text-sm text-slate-400">0d</span>
                            <span className="text-sm text-slate-400">{formatTime(maxReviewTime)}</span>
                        </div>
                    </div>

                    {sizeLabels.map(({ key, label }) => {
                        const stats = matrix[key];

                        return (
                            <div key={key} className="contents">
                                <span className="col-span-3 text-sm">{label}</span>
                                {stats.count > 0 ? (
                                    <div className="col-span-9 flex items-center h-full pt-1">
                                        <HorizontalBar
                                            p50Value={matrix[key]?.p50 || 0}
                                            p90Value={matrix[key]?.p90 || 0}
                                            max={maxReviewTime}
                                            sizeLabel={label}
                                        />
                                    </div>
                                ) : (
                                    <span className="text-slate-400 col-span-11 text-sm">All PRs in this category have no reviews yet</span>
                                )}
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

const HorizontalBar = ({ p50Value, p90Value, max, sizeLabel }: { p50Value: number, p90Value: number, max: number, sizeLabel: string }) => {
    const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

    const Point = ({ value, color }: { value: number, color: string }) => (
        <div className={`
            h-3 w-3 
            absolute top-1/2 -translate-y-1/2 -translate-x-1/2
            rounded-full 
            ${color} border-2 border-slate-300 
        `} style={{
                left: `${value / max * 100}%`,
            }}></div>
    )

    return (
        <div
            className="h-1 bg-slate-600 hover:bg-slate-500 transition-colors rounded-md relative flex-grow w-full cursor-crosshair"
            onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
            onMouseLeave={() => setMousePos(null)}
        >
            <Point value={p50Value} color="bg-blue-500" />
            <Point value={p90Value} color="bg-green-600" />

            {mousePos && (
                <div
                    className="fixed z-[1000] p-3 text-sm grid gap-1 bg-slate-800 text-slate-300 border-slate-700 border rounded-md shadow-md pointer-events-none"
                    style={{ left: mousePos.x + 15, top: mousePos.y + 15 }}
                >
                    <span className="font-extrabold text-white text-center pb-1 mb-1 border-b border-slate-600">{sizeLabel}</span>
                    <div className="flex flex-col">
                        <span>P50: {formatTime(p50Value)}</span>
                        <span>P90: {formatTime(p90Value)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

const MetricLegends = () => {
    return (
        <div className="flex py-4">
            <div className="flex gap-8">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block bg-blue-500 border-2 border-slate-300"></span>
                    <span className="text-sm">P50</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block bg-green-600 border-2 border-slate-300"></span>
                    <span className="text-sm">P90</span>
                </div>
            </div>
        </div>
    )
}

const MetricTooltip = () => {
    return (
        <InfoTooltip>
            <p>
                Shows the distribution of pull requests based on their size (number of lines added/removed) and the time it took to receive the first review.
            </p>
        </InfoTooltip>
    );
}

const calculatePRSizeMatrix = (data: Repository[]): { matrix: PRSizeMatrix, maxReviewTime: number } => {
    const buckets: Record<string, number[]> = {
        [PullRequestSize.SMALL]: [],
        [PullRequestSize.MEDIUM]: [],
        [PullRequestSize.LARGE]: [],
        [PullRequestSize.EXTRA_LARGE]: [],
    };

    let globalMax = 0;

    for (let i = 0; i < data.length; i++) {
        const repo = data[i];
        const prs = repo.getOpenPullRequests().concat(repo.getMergedPullRequests());

        for (let j = 0; j < prs.length; j++) {
            const pr = prs[j];
            const ttfrMinutes = pr.getTimeToFirstReviewMin();

            if (ttfrMinutes !== null) {
                const days = Number((ttfrMinutes / 1440).toFixed(0));
                buckets[pr.getSize()].push(ttfrMinutes);
                if (days > globalMax) globalMax = days;
            }
        }
    }

    const calcPercentile = (arr: number[], p: number) => {
        if (arr.length === 0) return 0;
        const index = Math.ceil((p / 100) * arr.length) - 1;
        return arr[index] || 0;
    };

    let maxP90 = 0;

    const matrix = Object.keys(buckets).reduce((acc, size) => {
        const values = buckets[size];
        if (values.length > 0) {
            values.sort((a, b) => a - b);
            const p50 = calcPercentile(values, 50);
            const p90 = calcPercentile(values, 90);

            if (p90 > maxP90) maxP90 = p90;

            acc[size] = {
                p50,
                p90,
                count: values.length,
            };
        } else {
            acc[size] = { p50: 0, p90: 0, count: 0 };
        }
        return acc;
    }, {} as PRSizeMatrix);

    let adjustedMax = maxP90 * 1.1; // Add 10% padding so the p90 dot isn't exactly hugging the right border
    if (adjustedMax > 0 && adjustedMax < 1) {
        adjustedMax = Number(adjustedMax.toFixed(2));
        if (adjustedMax === 0) adjustedMax = 0.05;
    } else {
        adjustedMax = Math.ceil(adjustedMax);
    }

    return { matrix, maxReviewTime: adjustedMax };
}