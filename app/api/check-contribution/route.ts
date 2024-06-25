import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/authConfig";
import Client, { NetworkId } from "mina-signer";
import config from "@/lib/config";
import { stringToBigInt } from "@/lib/stringUtils";

const client = new Client({
  network: (process.env.NETWORK_KIND ?? "testnet") as NetworkId,
});

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
      {
        data: {
          repoOwner,
          repoName,
          userName: session.user.name,
          contributed: false,
        },
        signature: null,
        publicKey: null,
      },
      { status: response.status },
    );
  }

  const contributors = await response.json();
  const hasContributed = contributors.some(
    (contributor: any) => contributor.login === session.user.name,
  );
  // temporarily spoof a contribution count
  let contributions = hasContributed ? 67 : 0;
  let signedResponse = getSignedResponse(
    session.user.name,
    repoOwner,
    repoName,
    contributions,
  );

  return NextResponse.json(signedResponse);
}

// Implement toJSON for BigInt so we can include values in response
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export interface SignedResponse {
  data: {
    repoOwner: string;
    repoName: string;
    userName: string;
    contributions: number;
  };
  signature: string | null;
  publicKey: string | null;
}

function getSignedResponse(
  userName: string,
  repoOwner: string,
  repoName: string,
  contributions: number,
): SignedResponse {
  let privateKey = config.oraclePrivateKey;
  const result: SignedResponse = {
    data: { userName, repoOwner, repoName, contributions: contributions },
    signature: null,
    publicKey: null,
  };
  if (contributions > 0) {
    const signature = client.signFields(
      [stringToBigInt(userName), BigInt(contributions)],
      privateKey,
    );
    result.signature = signature.signature;
    result.publicKey = signature.publicKey;
  }

  return result;
}
