import { NextResponse } from "next/server";
import { getAllGithubOpenPullRequests } from "@/lib/api/github/github.api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repository = searchParams.get("repository");

  if (!repository) {
    return NextResponse.json({ error: "Repository is required" }, { status: 400 });
  }

  try {
    const data = await getAllGithubOpenPullRequests(repository);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
