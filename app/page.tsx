import { GithubPullRequestAnalysisContainer } from "@/components/github/GithubPullRequestAnalysisContainer";

export default function Page() {
  return (
    <div className="p-6">
      <div className="pb-6 mb-6 border-b border-mist-800">
        <h1 className="text-2xl font-bold mb-2">Payment Platform Performance Dashboard</h1>
        <p className="text-sm text-slate-400">Source: Github API</p>
      </div>
      <GithubPullRequestAnalysisContainer />
    </div>
  )
}
