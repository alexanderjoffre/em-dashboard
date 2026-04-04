import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Repository } from "@/types/github/Repository";

interface NotReviewedPullRequestCountProps {
    data: Repository[];
}

import { getMetricCardTheme } from "@/lib/utils/metricCardTheme";

export const NotReviewedPullRequestCount = ({ data }: NotReviewedPullRequestCountProps) => {
    const percentageThresholds = {
        alert: 50,
        critical: 75,
    };

    let totalPR: number = 0;
    let notReviewedPR: number = 0;

    data.forEach((repo) => {
        totalPR += repo.getOpenPullRequests().length;
        notReviewedPR += repo.getOpenPullRequests().filter((pr) => !pr.hasReviews()).length;
    });

    const notReviewedPRPercentage = ((notReviewedPR / totalPR) * 100);
    const cardColorTheme = getMetricCardTheme(notReviewedPRPercentage, percentageThresholds);

    return (
        <Card className={`${cardColorTheme.cardBackGround} min-h-full flex flex-col justify-between`}>
            <CardHeader>
                <div className="flex items-center gap-2 justify-between">
                    <h4 className={`text-lg font-semibold ${cardColorTheme.textSecondaryColor}`}>PR Without Review</h4>
                    <MetricTooltip />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-2">
                    <span className={`text-4xl font-bold ${cardColorTheme.textPrimaryColor}`}>
                        {notReviewedPR}
                    </span>
                    <span className={`text-2xl ${cardColorTheme.textSecondaryColor}`}>/</span>
                    <span className={`text-2xl ${cardColorTheme.textSecondaryColor}`}>{notReviewedPRPercentage.toFixed(1)}%</span>
                </div>
            </CardContent>
        </Card>
    );
}

const MetricTooltip = () => {
    return (
        <InfoTooltip>
            <p className="font-extrabold">
                Shows the total number of open pull requests that have not received any reviews yet.
            </p>
        </InfoTooltip>
    );
}