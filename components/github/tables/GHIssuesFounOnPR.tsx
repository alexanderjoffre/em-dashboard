import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Repository } from "@/types/github/Repository";
import { PullRequest } from "@/types/github/PullRequest";
import { pseudoRandomBytes } from "node:crypto";
import { AlertTriangle, Ban } from "lucide-react";

interface GHIssuesFounOnPRProps {
    data: Repository[];
}

export const GHIssuesFounOnPR = ({ data }: GHIssuesFounOnPRProps) => {
    const excludedUsers = process.env.NEXT_PUBLIC_GH_EXCLUDED_USERS?.split(',').map(r => r.trim()) || [];
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
                (pr) => pr.hasIssues()
            )
        );
    });

    prWithoutTicket = prsWithoutTicket.length;
    prsWithoutTicket = prsWithoutTicket.sort((a, b) => b.getAge() - a.getAge());

    const prWithoutTicketPercentage = ((prWithoutTicket / totalPR) * 100);

    return (
        <Card className={`min-h-full flex flex-col justify-between`}>
            <CardHeader>
                <div className="flex items-center gap-2 justify-between">
                    <h4 className={`text-lg font-semibold`}>Github PR with issues</h4>
                    <MetricTooltip />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-2">
                    <span className={`text-4xl font-bold`}>
                        {prWithoutTicket}
                    </span>
                    <span className={`text-2xl`}>/</span>
                    <span className={`text-2xl`}>{prWithoutTicketPercentage.toFixed(1)}%</span>
                </div>
                {prsWithoutTicket.length > 0 && (
                    <table className="mt-8 w-full table-fixed">
                        <thead>
                            <tr className="border-b border-slate-600">
                                <th className="text-left pb-2">Author</th>
                                <th className="text-left pb-2">Repository</th>
                                <th className="text-left pb-2">No. PR</th>
                                <th className="text-left pb-2">Branch</th>
                                <th className="text-left pb-2">Age (working days)</th>
                                <th className="text-left pb-2">No Ticket</th>
                                <th className="text-left pb-2">Blocked</th>
                                <th className="text-left pb-2">Too Large (LOC)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prsWithoutTicket.map((pr) => {
                                const url = pr.getUrl().toString();

                                return (
                                    <tr className="group hover:bg-slate-500 transition duration-300 hover:cursor-pointer odd:bg-gray-800"
                                        onClick={() => window.open(url, "_blank")}
                                        key={pr.getId()}
                                    >
                                        <td className="py-2 px-2 transition duration-300 font-semibold">
                                            <div className="flex gap-2">
                                                <span>
                                                    {pr.getAuthor().isInactive() && <Ban className="text-red-500 w-4 h-4" />}
                                                </span>
                                                <span className="leading-none">
                                                    {pr.getAuthor().getName()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-2 transition duration-300 font-semibold">
                                            {pr.getUrl().getRepositoryName()}
                                        </td>
                                        <td className="py-2 transition duration-300 font-bold italic">
                                            #{pr.getUrl().getPullRequestNumber()}
                                        </td>
                                        <td className="py-2 transition duration-300 font-bold italic">
                                            {pr.getSourceBranchName()} → {pr.getTargetBranchName()}
                                        </td>
                                        <td>
                                            {pr.getAge() > 7 && `${pr.getAge()} days`}
                                        </td>
                                        <td>
                                            {pr.hasJiraTicket() && <AlertTriangle className="text-amber-600" />}
                                        </td>
                                        <td>
                                            {pr.isBlocked() && <AlertTriangle className="text-amber-600" />}
                                        </td>
                                        <td>
                                            {pr.isTooLarge() && (
                                                <div className="flex gap-2">
                                                    <span className="text-green-500">+{pr.getAdditions()}</span>
                                                    <span> / </span>
                                                    <span className="text-red-700">-{pr.getDeletions()}</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </CardContent>
        </Card>
    );
}

const MetricTooltip = () => {
    return (
        <InfoTooltip>
            <p>
                List of all PR with at least one issue detected
            </p>
        </InfoTooltip>
    );
}