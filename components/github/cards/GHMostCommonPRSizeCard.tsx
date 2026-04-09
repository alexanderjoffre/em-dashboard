import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Repository } from "@/types/github/Repository";
import { getMetricCardTheme } from "@/lib/utils/metricCardTheme";
import { PullRequest } from "@/types/github/PullRequest";
import { PullRequestSize } from "@/types/github/PullResquestSize";

interface GHMostCommonPRSizeCardProps {
    data: Repository[];
}

export const GHMostCommonPRSizeCard = ({ data }: GHMostCommonPRSizeCardProps) => {
    const timeThresholds = {
        alert: 200,       // Medium
        critical: 1000,   // Extra Large
    };

    const prSizeAbbreviation: Record<PullRequestSize, string> = {
        [PullRequestSize.SMALL]: "S",
        [PullRequestSize.MEDIUM]: "M",
        [PullRequestSize.LARGE]: "L",
        [PullRequestSize.EXTRA_LARGE]: "XL",
    };

    const prOrderderByChangedLines: PullRequest[] = data.reduce((list: PullRequest[], repo: Repository) => {
        return [
            ...list,
            ...repo.getOpenPullRequests(),
            ...repo.getMergedPullRequests()
        ];
    }, [])
        .sort((a, b) => a.getChangedLines() - b.getChangedLines());

    const p50PR = prOrderderByChangedLines[
        Math.floor(prOrderderByChangedLines.length / 2)
    ];

    const cardColorTheme = getMetricCardTheme(p50PR.getChangedLines(), timeThresholds);

    return (
        <Card className={`${cardColorTheme.cardBackGround} min-h-full flex flex-col justify-between`}>
            <CardHeader>
                <div className="flex items-center gap-2 justify-between">
                    <h4 className={`text-md font-semibold ${cardColorTheme.textSecondaryColor}`}>Most common PR size</h4>
                    <MetricTooltip />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-2">
                    <span className={`text-3xl font-semibold ${cardColorTheme.textPrimaryColor}`}>
                        {prSizeAbbreviation[p50PR.getSize()]}
                    </span>
                    <span className={`text-xl ${cardColorTheme.textSecondaryColor}`}>/</span>
                    <span className={`text-xl ${cardColorTheme.textSecondaryColor}`}>{p50PR.getChangedLines()} lines</span>
                </div>
            </CardContent>
        </Card>
    );
}

const MetricTooltip = () => {
    return (
        <InfoTooltip>
            <p className="mb-4">
                Shows the most common size of pull requests based on the number of lines changed. It considers both open and merged pull requests.
            </p>
            <p className="mb-2">
                The breakdown by size is as follows:
            </p>
            <ul className="flex flex-col gap-1">
                <li>
                    <strong className="font-medium">Small (S):</strong> less than 200 lines of code
                </li>
                <li>
                    <strong className="font-medium">Medium (M):</strong> between 200 and 500 lines of code
                </li>
                <li>
                    <strong className="font-medium">Large (L):</strong> between 500 and 1000 lines of code
                </li>
                <li>
                    <strong className="font-medium">Extra Large (XL):</strong> more than 1000 lines of code
                </li>
            </ul>
        </InfoTooltip>
    );
}