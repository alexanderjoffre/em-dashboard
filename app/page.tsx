import { GithubPullRequestAnalysisContainer } from "@/components/github/GithubPullRequestAnalysisContainer";

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold pb-6 mb-6 border-b border-mist-800">Payment Platform Dashboard</h1>
      <GithubPullRequestAnalysisContainer />
    </div>
  )
}
