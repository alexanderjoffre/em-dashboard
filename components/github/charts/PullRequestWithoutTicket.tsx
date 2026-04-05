import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Repository } from "@/types/github/Repository";
import { getMetricCardTheme } from "@/lib/utils/metricCardTheme";
import { PullRequest } from "@/types/github/PullRequest";

interface PullRequestWithoutTicketProps {
    data: Repository[];
}

export const PullRequestWithoutTicket = ({ data }: PullRequestWithoutTicketProps) => {
    const percentageThresholds = {
        alert: 10,
        critical: 20,
    };

    const prsWithoutTicket: PullRequest[] = [];
    let totalPR: number = 0;
    let prWithoutTicket: number = 0;

    data.forEach((repo) => {
        totalPR += repo.getOpenPullRequests().length;
        prsWithoutTicket.push(...repo.getOpenPullRequests().filter((pr) => !pr.hasJiraTicket()));
    });

    prWithoutTicket = prsWithoutTicket.length;

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
                <div className="grid gap-2">
                    {prsWithoutTicket.map((pr) => (
                        <a className="flex" href={pr.getUrl()} target="_blank">
                            <span>{pr.getUrl()}</span>
                        </a>
                    ))}
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