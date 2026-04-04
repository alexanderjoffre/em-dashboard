import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Repository } from "@/types/github/Repository";

interface TimeToFirstReviewOnPRProps {
    data: Repository[];
}

export const TimeToFirstReviewOnPR = ({ data }: TimeToFirstReviewOnPRProps) => {
    const pullRequestCount = data.reduce((acc, repo) => {
        return acc + repo.getOpenPullRequests().length;
    }, 0);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2 justify-between">
                    <h4 className="text-lg font-semibold text-slate-400">Open Pull Requests</h4>
                    <MetricTooltip />
                </div>
            </CardHeader>
            <CardContent>
                <span className="text-4xl font-bold text-slate-200">
                    {pullRequestCount}
                </span>
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