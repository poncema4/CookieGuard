import { spawn } from "node:child_process";
import process from "node:process";
import { BACKEND_ORIGIN } from "./dev-config.mjs";

const npmCli = process.env.npm_execpath;

if (!npmCli) {
  throw new Error("npm_execpath is not available. Run this script through npm.");
}

const baseEnv = {
  ...process.env,
  COOKIEGUARD_BACKEND_ORIGIN: BACKEND_ORIGIN,
};

const processes = [
  {
    name: "backend",
    args: [npmCli, "run", "dev", "--workspace=@cookieguard/backend"],
    env: baseEnv,
  },
  {
    name: "frontend",
    args: [npmCli, "run", "dev", "--workspace=@cookieguard/frontend"],
    env: {
      ...baseEnv,
      NODE_OPTIONS: [process.env.NODE_OPTIONS, "--use-system-ca"]
        .filter(Boolean)
        .join(" "),
    },
  },
];

const children = processes.map(({ name, args, env }) => {
  const child = spawn(process.execPath, args, {
    cwd: process.cwd(),
    env,
    stdio: "inherit",
    shell: false,
  });

  child.on("error", (error) => {
    console.error(`[${name}] failed to start:`, error);
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      console.log(`[${name}] stopped by ${signal}`);
    } else {
      console.log(`[${name}] exited with code ${code ?? 0}`);
    }
  });

  return child;
});

const shutdown = (signal) => {
  for (const child of children) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

const exitCodes = new Set();
for (const child of children) {
  child.on("exit", (code) => {
    exitCodes.add(code ?? 0);

    if (exitCodes.size === 1) {
      shutdown("SIGINT");
    }
  });
}
