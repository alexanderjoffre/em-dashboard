import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Repository } from "@/types/github/Repository";
import { getMetricCardTheme } from "@/lib/utils/metricCardTheme";

interface GHBlockedPRCardProps {
    data: Repository[];
}

export const GHBlockedPRCard = ({ data }: GHBlockedPRCardProps) => {
    const percentageThresholds = {
        alert: 10,
        critical: 20,
    };

    let totalPR: number = 0;
    let blockedPR: number = 0;

    data.forEach((repo) => {
        totalPR += repo.getOpenPullRequests().length;
        blockedPR += repo.getOpenPullRequests().filter((pr) => pr.isBlocked()).length;
    });

    const blockedPRPercentage = ((blockedPR / totalPR) * 100);

    const cardColorTheme = getMetricCardTheme(blockedPRPercentage, percentageThresholds);

    return (
        <Card className={`${cardColorTheme.cardBackGround} min-h-full flex flex-col justify-between`}>
            <CardHeader>
                <div className="flex items-center gap-2 justify-between">
                    <h4 className={`text-md font-semibold ${cardColorTheme.textSecondaryColor}`}>Blocked PR</h4>
                    <MetricTooltip />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-2">
                    <span className={`text-3xl font-semibold ${cardColorTheme.textPrimaryColor}`}>
                        {blockedPR}
                    </span>
                    <span className={`text-xl ${cardColorTheme.textSecondaryColor}`}>/</span>
                    <span className={`text-xl ${cardColorTheme.textSecondaryColor}`}>{blockedPRPercentage.toFixed(1)}%</span>
                </div>
            </CardContent>
        </Card>
    );
}

const MetricTooltip = () => {
    return (
        <InfoTooltip>
            <p>
                Shows the total number of open pull requests that have not passed the required checks. Therefore, they are blocked from being merged.
            </p>
        </InfoTooltip>
    );
}