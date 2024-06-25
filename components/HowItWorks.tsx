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
            The Mina network verifies the proof and updates the network state.
          </li>
        </ul>
      </div>
    </section>
  );
}
