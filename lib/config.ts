interface Config {
  githubClientId: string;
  githubClientSecret: string;
  env: Environment;
}

export type Environment = "local" | "staging" | "production";
const config: Config = {
  githubClientId: process.env.GITHUB_CLIENT_ID || "",
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  env: (process.env.NEXT_PUBLIC_ENV as Environment) || "local",
};

export default config;
