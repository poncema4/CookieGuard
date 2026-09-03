import { spawnSync } from "node:child_process";
import process from "node:process";
import { BACKEND_ORIGIN } from "./dev-config.mjs";

const npmCli = process.env.npm_execpath;

if (!npmCli) {
  throw new Error("npm_execpath is not available. Run this script through npm.");
}

const env = {
  ...process.env,
  COOKIEGUARD_BACKEND_ORIGIN: BACKEND_ORIGIN,
};

const commands = [
  {
    label: "Backend unit and security tests",
    args: [npmCli, "run", "test", "--workspace=@cookieguard/backend"],
  },
  {
    label: "Backend TypeScript build",
    args: [npmCli, "run", "build", "--workspace=@cookieguard/backend"],
  },
  {
    label: "Frontend production build",
    args: [npmCli, "run", "build", "--workspace=@cookieguard/frontend"],
  },
];

for (const { label, args } of commands) {
  console.log(`\n=== ${label} ===`);

  const result = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    env,
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("\nCookieGuard verification checks passed.");
