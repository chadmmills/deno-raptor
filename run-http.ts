const appServer = Deno.run({
  cmd: ["deno", "run", "server/index.ts"],
});

const appServerStatus = await appServer.status();

console.log(`appServer exited with code ${appServerStatus.code}`);
