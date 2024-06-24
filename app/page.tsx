"use client";
import { useState } from "react";
import GithubAuthButton from "@/components/GithubAuthButton";
import { useSession } from "next-auth/react";

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
    const data = await response.json();
    setHasContributed(data.hasContributed);
  };

  // useEffect(() => {
  //   const minaProvider: MinaProvider = window["mina"] as any;
  //   (async () => {
  //     const { fetchAccount, PublicKey, Mina } = await import("o1js");
  //     const { Add } = await import("oracle-contracts");
  //
  //     // Network configuration
  //     const network = Mina.Network({
  //       mina: "http://127.0.0.1:8080/graphql",
  //       archive: "http://127.0.0.1:8282",
  //       lightnetAccountManager: "http://127.0.0.1:8181",
  //     });
  //     Mina.setActiveInstance(network);
  //     const accountsResult = await minaProvider.requestAccounts();
  //     if (!Array.isArray(accountsResult)) {
  //       throw Error(JSON.stringify(accountsResult));
  //     }
  //
  //     const addAddress =
  //       "B62qiUyHpPCsxoxPMupGkGNtQEeUqhnoVDuD3ksZsCs5JndmJN1iVdT";
  //     await fetchAccount({ publicKey: addAddress });
  //     await Add.compile();
  //     const addApp = new Add(PublicKey.fromBase58(addAddress));
  //
  //     let num = addApp.num.get();
  //     console.log("initial number", num);
  //
  //     const tx = await Mina.transaction(
  //       PublicKey.fromBase58(accountsResult[0]),
  //       async () => {
  //         await addApp.update();
  //       },
  //     );
  //     await tx.prove();
  //     await minaProvider.sendTransaction({
  //       transaction: tx.toJSON(),
  //     });
  //     num = addApp.num.get();
  //
  //     console.log("new number", num);
  //   })();
  // }, []);
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
              zero knowledge proof and we&apos;ll mint you 64 MINA.
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
              The backend oracle verifies the user's contribution to a
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
              smart contract creates a state change, increasing the user's
              balance, and emits an event stating that the user's address is
              associated with a GitHub account that's contributed to an
              ecosystem project.
            </li>
            <li className="pl-4">
              Execution of the contract generates a zero-knowledge proof that
              the state change is valid and that the oracle has deemed the user
              eligible for the reward.
            </li>
            <li className="pl-4">
              Public inputs: Account updates from smart contract execution, like
              the user's balance increasing.
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
