# Mina zkApp: GitHub Contribution Reward System

## Overview

This project is a Mina zkApp that allows users to prove their contributions to a specified GitHub repository within the Mina ecosystem and claim a token reward. The process ensures user privacy by utilizing zero-knowledge proofs (zk-SNARKs), enabling users to prove their contributions without revealing their identity or specific contributions.

## Features

- **OAuth Authentication:** Users authenticate with GitHub via OAuth in the application.
- **Oracle Verification:** The back end acts as an oracle, verifying the user's contribution to a whitelisted Mina ecosystem repository.
- **Signed Message:** The oracle returns a signed message confirming the user's eligibility for the reward.
- **Zero-Knowledge Proof:** The zkApp contracts verify the signed message and generate a zk proof that the user contributed and is eligible without disclosing their identity or specific contribution.

## Table of Contents

1. [Architecture](#architecture)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Contributing](#contributing)
6. [License](#license)

## Architecture

1. **Frontend:**

   - Handles GitHub OAuth authentication.
   - Communicates with the back end to submit user details and receive verification.
   - Uses o1js to run the prover function for the smart contract. This generates a zero-knowledge proof that the user
     has been deemed eligible for the reward by the back end.
     - Public inputs to the proof are the account updates caused by the smart contract execution, like the user's
       balance
       increasing.
     - Private inputs to the proof are all method arguments passed into the smart contract, in this case, the signed
       message data from the back end.

2. **Backend:**

   - Acts as an oracle to verify GitHub contributions against a set of whitelisted repositories in the Mina ecosystem.
   - Returns a signed message confirming the user's eligibility.

3. **Mina zkApp:**
   - Verifies the signed message from the oracle.
   - Sends MINA to eligible users.
   - Emits an event signaling that the user's address is associated with a github account that earned the reward

## Installation

1. **Configure NPM and Install dependencies:**

```bash
nvm use
npm i
```

2. **Create Github Oauth application**
   - Sign in to GitHub and go to **Settings** > **Developer settings** > **OAuth Apps**.
   - Click **New OAuth App** and fill in the required details.
   - Set the **Authorization callback URL** to your app's callback URL.
     - This will depend on whether you're developing locally or using hosting, for local dev use `http://localhost:3000/auth/callback`.
   - Click **Register application**.
   - Note down the **Client ID** and **Client Secret** for configuring your app.
3. **Generate a NextAuth secret**

```bash
openssl rand -base64 32
```

4. **Configure env vars with values from the Oauth app:**

```bash
cp .env.example .env.local

GITHUB_CLIENT_ID= # retrieve from your github oauth app
GITHUB_CLIENT_SECRET= # retrieve from your github oauth app
NEXTAUTH_SECRET= # 32 byte base64 string, generate one with openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000 # authentication url for NextAuth to use, for local dev use localhost

```

5. **Serve the app locally**

```bash
npm run dev
```
