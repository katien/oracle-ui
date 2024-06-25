"use client";
import { useEffect, useState } from "react";
import GithubAuthButton from "@/components/GithubAuthButton";
import { useSession } from "next-auth/react";
import { SignedResponse } from "@/app/api/check-contribution/route";
import MinaProvider from "@aurowallet/mina-provider";
import { stringToBigInt } from "oracle-contracts/build/utils/stringUtils";

const CheckContributionForm = () => {
  const { data: session } = useSession();
  const [repoOwner, setRepoOwner] = useState("");
  const [repoName, setRepoName] = useState("");
  const [hasContributed, setHasContributed] = useState<boolean | null>(null);

  const checkContribution = async () => {
    const response = await fetch("/api/check-contribution", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoOwner, repoName }),
    });
    const data = (await response.json()) as SignedResponse;
    setHasContributed(data.data.contributions > 0);
  };

  useEffect(() => {
    if (!window) return;
    // @ts-ignore
    const minaProvider: MinaProvider = window["mina"] as any;
    (async () => {
      const { Field, Signature, fetchAccount, PublicKey, Mina } = await import(
        "o1js"
      );
      const { TokenDrop } = await import("oracle-contracts");

      // Network configuration
      const network = Mina.Network({
        mina: "http://127.0.0.1:8080/graphql",
        archive: "http://127.0.0.1:8282",
        lightnetAccountManager: "http://127.0.0.1:8181",
      });
      Mina.setActiveInstance(network);
      const accountsResult = await minaProvider.requestAccounts();
      if (!Array.isArray(accountsResult)) {
        throw Error(JSON.stringify(accountsResult));
      }

      const tokenDropAddress =
        "B62qjm7vuCrZwLSsnSnq8n6Kg9nkvSBC8nEWxpKGqzSjEH2gADT4WZr";
      await fetchAccount({ publicKey: tokenDropAddress });
      await TokenDrop.compile();
      const tokenDropApp = new TokenDrop(
        PublicKey.fromBase58(tokenDropAddress),
      );

      let minContributions = tokenDropApp.minContributions.get();
      console.log("minContributions", minContributions);

      const contributions = 67;
      const username = "katien";
      const fieldEncodedUsername = Field(stringToBigInt(username));
      const signature = Signature.fromBase58(
        "7mXBiworTwfx5fYu5nFrgQGxZworLmh8oictQGXw8SDR1z3CEJJbiBitfFrADazUj7AYr5GMTT2b8Vdq6gpwCTNJ2uhB4MUx",
      );

      const tx = await Mina.transaction(
        PublicKey.fromBase58(accountsResult[0]),
        async () => {
          await tokenDropApp.verifyContribution(
            fieldEncodedUsername,
            Field(contributions),
            signature,
          );
        },
      );
      await tx.prove();
      await minaProvider.sendTransaction({
        transaction: tx.toJSON(),
      });

      // window.app = tokenDropApp;
      // check that the verification event was emitted
      // const events = await tokenDropApp.fetchEvents();
      // const verifiedEventValue = events[0].event.data.toFields(null)[0];
      // console.log("verifiedEventValue", verifiedEventValue);
      console.log("Field encoded username", fieldEncodedUsername);
    })();
  }, []);
  return (
    <>
      <div className="flex justify-end">
        <GithubAuthButton />
      </div>
      <form>
        <h1 className="mt-20 mb-6 text-3xl font-bold leading-tight tracking-tight">
          Mina Token Claim
        </h1>
        <div className="space-y-12">
          <div className="border-b border-white/10 pb-12">
            <p className="text-sm leading-6 text-gray-400">
              If you&apos;ve contributed to a Mina ecosystem project,
              you&apos;re eligible for a claim! Verify your contribution with a
              zero knowledge proof and we&apos;ll mint you some MINA.
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-400">
              Enter the details of the repository you contributed to.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="repoOwner"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Repository Owner
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                    <input
                      type="text"
                      name="repoOwner"
                      id="repoOwner"
                      className="flex-1 border-0 bg-transparent py-1.5 pl-2 text-white focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Owner"
                      value={repoOwner}
                      onChange={(e) => setRepoOwner(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="repoName"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Repository Name
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                    <input
                      type="text"
                      name="repoName"
                      id="repoName"
                      className="flex-1  border-0 bg-transparent py-1.5 pl-2 text-white focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Repository"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                {hasContributed !== null && (
                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    {hasContributed
                      ? "You have contributed to this repository!"
                      : "You have not contributed to this repository."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-white"
            onClick={() => {
              setRepoOwner("");
              setRepoName("");
              setHasContributed(null);
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!session}
            onClick={checkContribution}
            className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
              session ? "bg-indigo-500 hover:bg-indigo-400" : "bg-indigo-500"
            }`}
          >
            Check Contribution
          </button>
        </div>
      </form>

      <section>
        <h1 className="text-3xl mt-12 font-bold mb-4">
          How the Mina GitHub Contribution Reward App Works
        </h1>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Step 1: Auth</h3>
          <ul className="list-disc list-inside space-y-2">
            <li className="pl-4">
              The user authenticates with GitHub via OAuth in the browser.
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Step 2: Verification</h3>
          <ul className="list-disc list-inside space-y-2">
            <li className="pl-4">
              The backend oracle verifies the user&apos;s contribution to a
              whitelisted Mina repository using their OAuth token. It returns a
              signed message to the browser stating that the user has
              contributed to a whitelisted repository.
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">
            Step 3: Proof Generation
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li className="pl-4">
              The frontend executes the token drop smart contract with o1js. The
              smart contract creates a state change, increasing the user&apos;s
              balance, and emits an event stating that the user&apos;s address
              is associated with a GitHub account that&apos;s contributed to an
              ecosystem project.
            </li>
            <li className="pl-4">
              Execution of the contract generates a zero-knowledge proof that
              the state change is valid and that the oracle has deemed the user
              eligible for the reward.
            </li>
            <li className="pl-4">
              Public inputs: Account updates from smart contract execution, like
              the user&apos;s balance increasing.
            </li>
            <li className="pl-4">
              Private inputs: Method arguments, including the signed message
              data from the backend.
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Step 4: Tx Broadcast</h3>
          <ul className="list-disc list-inside space-y-2">
            <li className="pl-4">
              The proof is broadcasted to the Mina network along with the
              associated account updates for the contract execution.
            </li>
            <li className="pl-4">
              The Mina network verifies the proof and updates the network state
              to reflect the new balance of the user.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default CheckContributionForm;
