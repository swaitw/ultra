import { serve } from "./deps.ts";
import {
  devServerWebsocketPort,
  isDev,
  port,
  sourceDirectory,
  vendorDirectory,
} from "./env.ts";
import { resolveConfig, resolveImportMap } from "./config.ts";
import { createRequestHandler } from "./server/requestHandler.ts";

const cwd = Deno.cwd();
const config = await resolveConfig(cwd);
const importMap = await resolveImportMap(cwd, config);

const server = async () => {
  const requestHandler = await createRequestHandler({
    cwd,
    importMap,
    paths: {
      source: sourceDirectory,
      vendor: vendorDirectory,
    },
    isDev,
  });

  let message = `Ultra running http://localhost:${port}`;

  if (isDev) {
    message += ` and ws://localhost:${devServerWebsocketPort}`;
  }

  console.log(message);

  return serve(requestHandler, { port: +port });
};

export default server;
