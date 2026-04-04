import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Repository } from "@/types/github/Repository";
import { getMetricCardTheme } from "@/lib/utils/metricCardTheme";

interface P50TimeToFirstReviewProps {
    data: Repository[];
}

export const P50TimeToFirstReview = ({ data }: P50TimeToFirstReviewProps) => {
    const timeThresholds = {
        alert: 24,       // 1 day
        critical: 72,   // 3 days
    };

    const listOfTimeToFirstReviewInMinutes: number[] = data.reduce((list: number[], repo: Repository) => {
        return [
            ...list,
            ...repo.getOpenPullRequests()
                .filter((pr) => pr.hasReviews())
                .map((pr) => pr.getTimeToFirstReviewMin()!),
            ...repo.getMergedPullRequests()
                .filter((pr) => pr.hasReviews())
                .map((pr) => pr.getTimeToFirstReviewMin()!),
        ];
    }, []);

    const p50TimeToFirstReview = listOfTimeToFirstReviewInMinutes.sort((a, b) => a - b)[
        Math.floor(listOfTimeToFirstReviewInMinutes.length / 2)
    ];

    const p50TimeToFirstReviewInHours = p50TimeToFirstReview / 60;
    const cardColorTheme = getMetricCardTheme(p50TimeToFirstReviewInHours, timeThresholds);

    return (
        <Card className={`${cardColorTheme.cardBackGround} min-h-full flex flex-col justify-between`}>
            <CardHeader>
                <div className="flex items-center gap-2 justify-between">
                    <h4 className={`text-lg font-semibold ${cardColorTheme.textSecondaryColor}`}>P50 Time to first review</h4>
                    <MetricTooltip />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-2">
                    <span className={`text-4xl font-bold ${cardColorTheme.textPrimaryColor}`}>
                        {p50TimeToFirstReviewInHours < 1
                            ? p50TimeToFirstReview.toFixed(0)
                            : p50TimeToFirstReviewInHours < 24
                                ? p50TimeToFirstReviewInHours.toFixed(0)
                                : (p50TimeToFirstReviewInHours / 24).toFixed(0)
                        }
                    </span>
                    <span className={`text-2xl ${cardColorTheme.textSecondaryColor}`}>
                        {p50TimeToFirstReviewInHours < 1
                            ? "minutes"
                            : p50TimeToFirstReviewInHours < 24
                                ? "hours"
                                : "days"
                        }
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
                Shows the median time (P50) it takes for the first review to be added to a pull request. It only considers pull requests that have at least one review.
            </p>
        </InfoTooltip>
    );
}