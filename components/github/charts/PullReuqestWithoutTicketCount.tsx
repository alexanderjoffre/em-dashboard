import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Repository } from "@/types/github/Repository";
import { getMetricCardTheme } from "@/lib/utils/metricCardTheme";

interface PullReuqestWithoutTicketCountProps {
    data: Repository[];
}

export const PullReuqestWithoutTicketCount = ({ data }: PullReuqestWithoutTicketCountProps) => {
    const percentageThresholds = {
        alert: 10,
        critical: 20,
    };

    let totalPR: number = 0;
    let prWithoutTicket: number = 0;

    data.forEach((repo) => {
        totalPR += repo.getOpenPullRequests().length;
        prWithoutTicket += repo.getOpenPullRequests().filter((pr) => pr.hasJiraTicket()).length;
    });

    const prWithoutTicketPercentage = ((prWithoutTicket / totalPR) * 100);

    const cardColorTheme = getMetricCardTheme(prWithoutTicketPercentage, percentageThresholds);

    return (
        <Card className={`${cardColorTheme.cardBackGround} min-h-full flex flex-col justify-between`}>
            <CardHeader>
                <div className="flex items-center gap-2 justify-between">
                    <h4 className={`text-lg font-semibold ${cardColorTheme.textSecondaryColor}`}>PR without Ticket</h4>
                    <MetricTooltip />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-2">
                    <span className={`text-4xl font-bold ${cardColorTheme.textPrimaryColor}`}>
                        {prWithoutTicket}
                    </span>
                    <span className={`text-2xl ${cardColorTheme.textSecondaryColor}`}>/</span>
                    <span className={`text-2xl ${cardColorTheme.textSecondaryColor}`}>{prWithoutTicketPercentage.toFixed(1)}%</span>
                </div>
            </CardContent>
        </Card>
    );
}

const MetricTooltip = () => {
    return (
        <InfoTooltip>
            <p className="font-extrabold">
                Shows the total number of open pull requests that do not have a corresponding Jira ticket linked.
            </p>
        </InfoTooltip>
    );
}