import { NextResponse } from "next/server";
import { getAllGithubOpenPullRequests } from "@/lib/api/github/github.api";

export async function GET() {
  try {
    const data = await getAllGithubOpenPullRequests();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
