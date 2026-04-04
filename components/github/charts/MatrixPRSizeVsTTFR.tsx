import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Repository } from "@/types/github/Repository";
import { PullRequestSize } from "@/types/github/PullResquestSize";

interface MatrixPRSizeVsTTFRProps {
    data: Repository[];
}

type SizeStats = { p50: number, p90: number, count: number };
type PRSizeMatrix = Record<string, SizeStats>;

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
                    <h4 className="text-lg font-semibold text-slate-400">
                        PR size vs Time to First Review
                    </h4>
                    <MetricTooltip />
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-10 col-start-3">
                        <div className="flex items-center gap-2 justify-between">
                            <span>0d</span>
                            <span>{maxReviewTime}d</span>
                        </div>
                    </div>

                    {sizeLabels.map(({ key, label }) => {
                        const stats = matrix[key];

                        return (
                            <div key={key} className="contents">
                                <span className="col-span-1">{label}</span>
                                {stats.count > 0 ? (
                                    <>
                                        <span className="col-span-1">{stats.count} PR</span>
                                        <div className="col-span-10 flex items-center h-full pt-1">
                                            <HorizontalBar
                                                p50Value={matrix[key]?.p50 || 0}
                                                p90Value={matrix[key]?.p90 || 0}
                                                max={maxReviewTime}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-slate-400 col-span-11">All PRs in this category have no reviews yet</span>
                                )}
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

const HorizontalBar = ({ p50Value, p90Value, max }: { p50Value: number, p90Value: number, max: number }) => {
    const Point = ({ value }: { value: number }) => (
        <div className="
            h-4 w-4 
            absolute top-1/2 -translate-y-1/2 -translate-x-1/2
            rounded-full 
            bg-blue-500 border-2 border-slate-300 
        " style={{
                left: `${value / max * 100}%`,
            }}></div>
    )

    return (
        <div className="h-2 bg-slate-600 rounded-md relative flex-grow w-full">
            <Point value={p50Value} />
            <Point value={p90Value} />
        </div>
    );
}

const MetricTooltip = () => {
    return (
        <InfoTooltip>
            <p className="font-extrabold">
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
                const days = Number((ttfrMinutes / 1440).toFixed(2));
                buckets[pr.getSize()].push(days);
                if (days > globalMax) globalMax = days;
            }
        }
    }

    const calcPercentile = (arr: number[], p: number) => {
        if (arr.length === 0) return 0;
        const index = Math.ceil((p / 100) * arr.length) - 1;
        return arr[index] || 0;
    };

    const matrix = Object.keys(buckets).reduce((acc, size) => {
        const values = buckets[size];
        if (values.length > 0) {
            values.sort((a, b) => a - b);
            acc[size] = {
                p50: calcPercentile(values, 50),
                p90: calcPercentile(values, 90),
                count: values.length,
            };
        } else {
            acc[size] = { p50: 0, p90: 0, count: 0 };
        }
        return acc;
    }, {} as PRSizeMatrix);

    return { matrix, maxReviewTime: globalMax > 0 ? Math.ceil(globalMax) : 1 };
}