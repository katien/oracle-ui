import { useState, useEffect } from "react";
import { stringToBigInt } from "@/lib/stringUtils";
import config from "@/lib/config";
import MinaProvider from "@aurowallet/mina-provider";

interface ProofGenerationProps {
  stars: number;
  username: string;
  signature: string;
}

export default function ProofGeneration({
  stars,
  username,
  signature,
}: ProofGenerationProps) {
  const [txJson, setTxJson] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [verificationEvent, setVerificationEvent] = useState<string | null>(
    null,
  );
  const [isCompiled, setIsCompiled] = useState<boolean>(false);
  const [minaProvider, setMinaProvider] = useState<any>(null);
  const [minaModules, setMinaModules] = useState<any>(null);
  const [tokenDropApp, setTokenDropApp] = useState<any>(null);

  useEffect(() => {
    async function initMina() {
      try {
        // Reset previous state
        setTxJson(null);
        setError(null);
        setStatus("Initializing...");
        setVerificationEvent(null);

        // @ts-ignore
        const minaProvider: MinaProvider = window["mina"] as any;
        const { Field, Signature, fetchAccount, PublicKey, Mina } =
          await import("o1js");
        const { TokenDrop } = await import("oracle-contracts");

        setStatus("Configuring Mina network connection...");
        // Network configuration - archive node may be needed for events
        const network = Mina.Network({
          mina: config.minaNodeUri,
          archive: config.minaArchiveNodeUri,
        });
        Mina.setActiveInstance(network);
        await fetchAccount({ publicKey: config.tokenDropContractAddress });

        setStatus("Compiling contract...");
        await TokenDrop.compile();
        const tokenDropAppInstance = new TokenDrop(
          PublicKey.fromBase58(config.tokenDropContractAddress),
        );

        setStatus("Retrieving min stars...");
        let minStars = tokenDropAppInstance.minStars.get();
        console.log("minStars", minStars);

        // Set states after successful initialization and compilation
        setMinaProvider(minaProvider);
        setMinaModules({ Field, Signature, PublicKey, Mina });
        setTokenDropApp(tokenDropAppInstance);
        setIsCompiled(true);
        setStatus(null); // Clear status after compilation
      } catch (err: any) {
        console.error("An error occurred:", err);
        setError(err.message);
        setStatus(null); // Clear status on error
      }
    }

    initMina();
  }, []);

  async function generateProof() {
    try {
      setStatus("Sending transaction with signed oracle message...");
      const { Field, Signature, PublicKey, Mina } = minaModules;

      const fieldEncodedUsername = Field(stringToBigInt(username));
      const signatureObject = Signature.fromBase58(signature);

      const accountsResult = await minaProvider?.requestAccounts();
      if (!minaProvider || !Array.isArray(accountsResult)) {
        throw new Error(
          "Failed to retrieve accounts - is Auro wallet installed?\n" +
            (accountsResult ? JSON.stringify(accountsResult) : ""),
        );
      }
      const tx = await Mina.transaction(
        PublicKey.fromBase58(accountsResult[0]),
        async () => {
          await tokenDropApp.verifyContribution(
            fieldEncodedUsername,
            Field(stars),
            signatureObject,
          );
        },
      );
      await tx.prove();

      // Set the transaction JSON to state before sending
      const transaction = tx.toJSON();
      setTxJson(JSON.stringify(JSON.parse(transaction), null, 4));
      setStatus("Sending transaction...");
      await minaProvider.sendTransaction({ transaction });

      setStatus("Transaction sent successfully!");
      // check that the verification event was emitted
      const events = await tokenDropApp.fetchEvents();
      const contributionVerifiedEvent = events[0].event.data
        .toFields(null)[0]
        .toString();
      setVerificationEvent(contributionVerifiedEvent);
      console.log("contributionVerifiedEvent event", contributionVerifiedEvent);
      console.log(
        `Username (${username}) encoded as a field: ${fieldEncodedUsername}`,
      );
    } catch (err: any) {
      console.error("An error occurred:", err);
      setError(err.message);
      setStatus(null); // Clear status on error
    }
  }

  return (
    <div>
      <button
        className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 flex items-center"
        onClick={generateProof}
        disabled={!isCompiled}
      >
        Generate proof
      </button>

      {status && (
        <p className="mt-3 text-sm leading-6 text-gray-400">Status: {status}</p>
      )}

      {error && (
        <p className="mt-3 text-sm leading-6 text-red-500">Error: {error}</p>
      )}

      {txJson && (
        <div className="mt-6">
          <label
            htmlFor="txJson"
            className="block text-sm font-medium leading-6 text-white"
          >
            Transaction JSON
          </label>
          <textarea
            id="txJson"
            name="txJson"
            rows={10}
            className="w-full rounded-md bg-gray-800 text-white p-2"
            readOnly
            value={txJson}
          />
        </div>
      )}

      {verificationEvent && (
        <div className="mt-6">
          <label
            htmlFor="verificationEvent"
            className="block text-sm font-medium leading-6 text-white"
          >
            Verification Event
          </label>
          <textarea
            id="verificationEvent"
            name="verificationEvent"
            rows={5}
            className="w-full rounded-md bg-gray-800 text-white p-2"
            readOnly
            value={`BigNumber encoding for string ${username}: ${stringToBigInt(username)}\nVerification event for transaction: ${verificationEvent}`}
          />
        </div>
      )}
    </div>
  );
}
