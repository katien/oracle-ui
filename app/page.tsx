"use client";
import { useState } from "react";
import GithubAuthButton from "@/components/GithubAuthButton";
import { useSession } from "next-auth/react";
import { OracleResponse } from "@/app/api/check-contribution/route";
import HowItWorks from "@/components/HowItWorks";
import ProofGeneration from "@/components/ProofGeneration";

const CheckContributionForm = () => {
  const { data: session } = useSession();
  const [repoOwner, setRepoOwner] = useState("");
  const [repoName, setRepoName] = useState("");
  const [hasContributed, setHasContributed] = useState<boolean | null>(null);
  const [apiResponse, setApiResponse] = useState<OracleResponse | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const checkContribution = async () => {
    setApiResponse(null); // Reset previous response
    setServerError(null); // Reset previous error

    const response = await fetch("/api/check-contribution", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoOwner, repoName }),
    });

    if (response.ok) {
      const oracleResponse = (await response.json()) as OracleResponse;
      setApiResponse(oracleResponse); // Pretty-print JSON
      setHasContributed(true);
      setServerError(null);
    } else {
      const errorMessage = (await response.json()).error;
      setServerError(errorMessage);
    }
  };

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

                {serverError && (
                  <p className="mt-3 text-sm leading-6 text-red-500">
                    Error: {serverError}
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
              setApiResponse(null);
              setServerError(null);
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

      {!!apiResponse && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Oracle Response</h3>
          <textarea
            id="apiResponse"
            name="apiResponse"
            rows={12}
            className="w-full rounded-md bg-gray-800 text-white p-2"
            readOnly
            value={JSON.stringify(apiResponse, null, 4)}
          />
          {apiResponse.signature && (
            <ProofGeneration
              stars={apiResponse.data.stars}
              username={apiResponse.data.userName}
              signature={apiResponse.signature}
            />
          )}
        </div>
      )}

      <HowItWorks />
    </>
  );
};

export default CheckContributionForm;
