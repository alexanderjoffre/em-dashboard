import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Repository } from "@/types/github/Repository";
import { getMetricCardTheme } from "@/lib/utils/metricCardTheme";
import { PullRequest } from "@/types/github/PullRequest";

const excludedUsers = process.env.NEXT_PUBLIC_GH_EXCLUDED_USERS?.split(',').map(r => r.trim()) || [];

interface GHPRWithoutTicketProps {
    data: Repository[];
}

export const GHPRWithoutTicket = ({ data }: GHPRWithoutTicketProps) => {
    const countThresholds = {
        alert: 5,
        critical: 50,
    };

    let prsWithoutTicket: PullRequest[] = [];
    let totalPR: number = 0;
    let prWithoutTicket: number = 0;

    data.forEach((repo) => {
        totalPR += repo.getOpenPullRequests().length;
        prsWithoutTicket.push(
            ...repo.getOpenPullRequests().filter(
                (pr) => !pr.hasJiraTicket() && !excludedUsers.includes(pr.getAuthor().getLogin())
            )
        );
    });

    prWithoutTicket = prsWithoutTicket.length;
    prsWithoutTicket = prsWithoutTicket.sort((a, b) => b.getAge() - a.getAge());

    const prWithoutTicketPercentage = ((prWithoutTicket / totalPR) * 100);

    const cardColorTheme = getMetricCardTheme(prWithoutTicketPercentage, countThresholds);

    return (
        <Card className={`${cardColorTheme.cardBackGround} min-h-full flex flex-col justify-between`}>
            <CardHeader>
                <div className="flex items-center gap-2 justify-between">
                    <h4 className={`text-md font-semibold ${cardColorTheme.textSecondaryColor}`}>PR without Ticket</h4>
                    <MetricTooltip />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-2">
                    <span className={`text-3xl font-bold ${cardColorTheme.textPrimaryColor}`}>
                        {prWithoutTicket}
                    </span>
                    <span className={`text-xl ${cardColorTheme.textSecondaryColor}`}>/</span>
                    <span className={`text-xl ${cardColorTheme.textSecondaryColor}`}>{prWithoutTicketPercentage.toFixed(1)}%</span>
                </div>
            </CardContent>
        </Card>
    );
}

const MetricTooltip = () => {
    return (
        <InfoTooltip>
            <p>
                Shows the total number of open pull requests that do not have a corresponding Jira ticket linked.
                The following github users were excluded from this analysis: <strong>{excludedUsers.join(', ')}</strong>
            </p>
        </InfoTooltip>
    );
}