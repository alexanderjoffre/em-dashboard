import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Repository } from "@/types/github/Repository";

interface OpenPullRequestCountProps {
    data: Repository[];
}

export const OpenPullRequestCount = ({ data }: OpenPullRequestCountProps) => {
    const pullRequestCount = data.reduce((acc, repo) => {
        return acc + repo.getOpenPullRequests().length;
    }, 0);

    return (
        <Card className="min-h-full flex flex-col justify-between">
            <CardHeader>
                <div className="flex items-center gap-2 justify-between">
                    <h4 className="text-lg font-semibold text-slate-400">Open Pull Requests</h4>
                    <MetricTooltip />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-slate-200">
                        {pullRequestCount}
                    </span>
                    <span className="text-2xl text-slate-400">/</span>
                    <span className="text-2xl text-slate-400">
                        {data.length} repos
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

const MetricTooltip = () => {
    return (
        <InfoTooltip>
            <p className="font-extrabold">
                Shows the total number of open pull requests across all analyzed repositories.
            </p>
        </InfoTooltip>
    );
}