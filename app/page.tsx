"use client";

import { useEffect } from "react";
import MinaProvider from "@aurowallet/mina-provider";

export default function Page() {
  useEffect(() => {
    const minaProvider: MinaProvider = window["mina"] as any;
    (async () => {
      const { fetchAccount, PublicKey, Mina } = await import("o1js");
      const { Add } = await import("oracle-contracts");

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

      const addAddress =
        "B62qiUyHpPCsxoxPMupGkGNtQEeUqhnoVDuD3ksZsCs5JndmJN1iVdT";
      await fetchAccount({ publicKey: addAddress });
      await Add.compile();
      const addApp = new Add(PublicKey.fromBase58(addAddress));

      let num = addApp.num.get();
      console.log("initial number", num);

      const tx = await Mina.transaction(
        PublicKey.fromBase58(accountsResult[0]),
        async () => {
          await addApp.update();
        },
      );
      await tx.prove();
      await minaProvider.sendTransaction({
        transaction: tx.toJSON(),
      });
      num = addApp.num.get();

      console.log("new number", num);
    })();
  }, []);
  return (
    <form>
      <h1 className="mt-20 mb-6 text-3xl font-bold leading-tight tracking-tight">
        Project Starter
      </h1>
      <div className="space-y-12">
        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">
            Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-white"
              >
                Username
              </label>
              <div className="mt-2">
                <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    workcation.com/
                  </span>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="janesmith"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="about"
                className="block text-sm font-medium leading-6 text-white"
              >
                About
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  defaultValue={""}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Write a few sentences about yourself.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Save
        </button>
      </div>
    </form>
  );
}
