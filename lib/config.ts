interface Config {
  githubClientId: string;
  githubClientSecret: string;
  oraclePrivateKey: string;
  env: Environment;
}

export type Environment = "local" | "staging" | "production";
const config: Config = {
  githubClientId: process.env.GITHUB_CLIENT_ID || "",
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  oraclePrivateKey: process.env.ORACLE_PRIVATE_KEY || "",
  env: (process.env.NEXT_PUBLIC_ENV as Environment) || "local",
};

export default config;
