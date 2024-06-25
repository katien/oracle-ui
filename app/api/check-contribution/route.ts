import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/authConfig";
import Client, { NetworkId } from "mina-signer";
import config from "@/lib/config";
import { stringToBigInt } from "@/lib/stringUtils";

export interface OracleResponse {
  data: {
    repoOwner: string;
    repoName: string;
    userName: string;
    stars: number;
  };
  signature: string | null;
  publicKey: string | null;
}

const client = new Client({
  network: (process.env.NETWORK_KIND ?? "testnet") as NetworkId,
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return NextResponse.json(
      { error: "User is not authenticated with GitHub" },
      { status: 401 },
    );
  }

  const { repoOwner, repoName } = await req.json();

  // Fetch contributors for the repository
  const contributorsResponse = await fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    { headers: { Authorization: `token ${session.accessToken}` } },
  );

  if (!contributorsResponse.ok)
    return NextResponse.json(
      {
        error:
          "Something went wrong fetching contribution info from GitHub:\n " +
          JSON.stringify(await contributorsResponse.json()),
      },
      { status: 500 },
    );

  // verify the user has contributed to the repo
  const contributors = await contributorsResponse.json();
  const hasContributed = contributors.some(
    (contributor: any) => contributor.login === session.user.name,
  );
  if (!hasContributed)
    return NextResponse.json(
      { error: "User did not contribute to repo" },
      { status: 403 },
    );

  // Fetch repository details to get the star count
  const repoResponse = await fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}`,
    { headers: { Authorization: `token ${session.accessToken}` } },
  );

  if (!repoResponse.ok)
    return NextResponse.json(
      {
        error:
          "Something went wrong fetching repository info from GitHub:\n" +
          JSON.stringify(await contributorsResponse.json()),
      },
      { status: 500 },
    );

  const repoDetails = await repoResponse.json();
  // Sign the response
  const signedResponse = signResponse(
    session.user.name,
    repoOwner,
    repoName,
    repoDetails.stargazers_count,
  );

  return NextResponse.json(signedResponse);
}

// Implement toJSON for BigInt so we can include values in response
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

function signResponse(
  userName: string,
  repoOwner: string,
  repoName: string,
  stars: number,
): OracleResponse {
  let privateKey = config.oraclePrivateKey;
  const result: OracleResponse = {
    data: { userName, repoOwner, repoName, stars },
    signature: null,
    publicKey: null,
  };
  const signature = client.signFields(
    [stringToBigInt(userName), BigInt(stars)],
    privateKey,
  );
  result.signature = signature.signature;
  result.publicKey = signature.publicKey;

  return result;
}
