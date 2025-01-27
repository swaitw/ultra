import assets from "./../assets.ts";
import { readableStreamFromReader, serve } from "./../deps.ts";
import render from "./../render.ts";

const sourceDirectory = Deno.env.get("source") || "src";
const vendorDirectory = Deno.env.get("vendor") || "x";
const root = Deno.env.get("root") || "http://localhost:8000";
const lang = Deno.env.get("lang") || "en";
const disableStreaming = Deno.env.get("disableStreaming") || 0;

const importMap = JSON.parse(await Deno.readTextFile("importMap.json"));

const deploy = async () => {
  const { raw } = await assets(sourceDirectory);
  const x = await assets(vendorDirectory);

  const handler = async (request: Request) => {
    const url = new URL(request.url);

    //API//

    // vendor
    if (x.raw.has(`${url.pathname.substring(1)}`)) {
      const headers = {
        "content-type": "text/javascript",
        "cache-control":
          "public, max-age=604800, stale-while-revalidate=86400, stale-if-error=259200",
      };

      const file = await Deno.open(
        `./${url.pathname}`,
      );
      const body = readableStreamFromReader(file);

      return new Response(body, { headers });
    }

    // static files
    if (raw.has(`${sourceDirectory}${url.pathname}`)) {
      const file = await Deno.open(`./${sourceDirectory}${url.pathname}`);
      const body = readableStreamFromReader(file);
      return new Response(body, {
        headers: {
          "content-type": raw.get(`${sourceDirectory}${url.pathname}`),
        },
      });
    }

    // let link = await Deno.readTextFile(`./${transpiled}/graph.json`);
    // link = JSON.parse(link);
    return new Response(
      await render({
        url,
        root,
        importMap,
        lang,
        disableStreaming: !!disableStreaming,
      }),
      {
        headers: {
          "content-type": "text/html; charset=utf-8",
          // link,
        },
      },
    );
  };
  return serve(handler);
};

export default deploy;
