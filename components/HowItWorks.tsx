"use client";

export default function HowItWorks() {
  return (
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
            signed message to the browser stating that the user has contributed
            to a whitelisted repository.
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Step 3: Proof Generation</h3>
        <ul className="list-disc list-inside space-y-2">
          <li className="pl-4">
            The frontend executes the token drop smart contract with o1js. The
            smart contract creates a state change, increasing the user&apos;s
            balance, and emits an event stating that the user&apos;s address is
            associated with a GitHub account that&apos;s contributed to an
            ecosystem project.
          </li>
          <li className="pl-4">
            Execution of the contract generates a zero-knowledge proof that the
            state change is valid and that the oracle has deemed the user
            eligible for the reward.
          </li>
          <li className="pl-4">
            Public inputs: Account updates from smart contract execution, like
            the user&apos;s balance increasing.
          </li>
          <li className="pl-4">
            Private inputs: Method arguments, including the signed message data
            from the backend.
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
            The Mina network verifies the proof and updates the network state to
            reflect the new balance of the user.
          </li>
        </ul>
      </div>
    </section>
  );
}

// useEffect(() => {
//   if (!window || !session) return;
//   // @ts-ignore
//   const minaProvider: MinaProvider = window["mina"] as any;
//   (async () => {
//     const { Field, Signature, fetchAccount, PublicKey, Mina } = await import(
//       "o1js"
//       );
//     const { TokenDrop } = await import("oracle-contracts");
//
//     // Network configuration
//     const network = Mina.Network({
//       mina: "http://127.0.0.1:8080/graphql",
//       archive: "http://127.0.0.1:8282",
//       lightnetAccountManager: "http://127.0.0.1:8181"
//     });
//     Mina.setActiveInstance(network);
//     const accountsResult = await minaProvider.requestAccounts();
//     if (!Array.isArray(accountsResult)) {
//       throw Error(JSON.stringify(accountsResult));
//     }
//
//     const tokenDropAddress =
//       "B62qjm7vuCrZwLSsnSnq8n6Kg9nkvSBC8nEWxpKGqzSjEH2gADT4WZr";
//     await fetchAccount({ publicKey: tokenDropAddress });
//     await TokenDrop.compile();
//     const tokenDropApp = new TokenDrop(
//       PublicKey.fromBase58(tokenDropAddress)
//     );
//
//     let minContributions = tokenDropApp.minContributions.get();
//     console.log("minContributions", minContributions);
//
//     const contributions = 67;
//     const username = "katien";
//     const fieldEncodedUsername = Field(stringToBigInt(username));
//     const signature = Signature.fromBase58(
//       "7mXBiworTwfx5fYu5nFrgQGxZworLmh8oictQGXw8SDR1z3CEJJbiBitfFrADazUj7AYr5GMTT2b8Vdq6gpwCTNJ2uhB4MUx"
//     );
//
//     const tx = await Mina.transaction(
//       PublicKey.fromBase58(accountsResult[0]),
//       async () => {
//         await tokenDropApp.verifyContribution(
//           fieldEncodedUsername,
//           Field(contributions),
//           signature
//         );
//       }
//     );
//     await tx.prove();
//     await minaProvider.sendTransaction({
//       transaction: tx.toJSON()
//     });
//
//     // window.app = tokenDropApp;
//     // check that the verification event was emitted
//     // const events = await tokenDropApp.fetchEvents();
//     // const verifiedEventValue = events[0].event.data.toFields(null)[0];
//     // console.log("verifiedEventValue", verifiedEventValue);
//     console.log("Field encoded username", fieldEncodedUsername);
//   })();
// }, []);
