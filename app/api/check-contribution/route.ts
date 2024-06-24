import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authConfig } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return NextResponse.json(
      { error: "User is not authenticated with github" },
      { status: 401 },
    );
  }

  const { repoOwner, repoName } = await req.json();
  const response = await fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    {
      headers: {
        Authorization: `token ${session.accessToken}`,
      },
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch contributors" },
      { status: response.status },
    );
  }

  const contributors = await response.json();
  const hasContributed = contributors.some(
    (contributor: any) => contributor.login === session.user.name,
  );

  return NextResponse.json({ hasContributed });
}
