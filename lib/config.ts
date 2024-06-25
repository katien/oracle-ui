interface Config {
  githubClientId: string;
  githubClientSecret: string;
  oraclePrivateKey: string;
  tokenDropContractAddress: string;
  minaNodeUri: string;
  minaArchiveNodeUri: string;
  env: Environment;
}

export type Environment = "local" | "staging" | "production";
const config: Config = {
  githubClientId: process.env.GITHUB_CLIENT_ID || "",
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  oraclePrivateKey: process.env.ORACLE_PRIVATE_KEY || "",
  tokenDropContractAddress:
    process.env.NEXT_PUBLIC_TOKEN_DROP_CONTRACT_ADDRESS || "",
  minaNodeUri: process.env.NEXT_PUBLIC_MINA_NODE_URI || "",
  minaArchiveNodeUri: process.env.NEXT_PUBLIC_MINA_ARCHIVE_NODE_URI || "",
  env: (process.env.NEXT_PUBLIC_ENV as Environment) || "local",
};

export default config;
