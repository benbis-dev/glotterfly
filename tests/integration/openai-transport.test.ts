import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import { listModels } from "../../packages/openai-transport/src/models";
import { streamResponse } from "../../packages/openai-transport/src/responses";

const servers: ReturnType<typeof createServer>[] = [];

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      (server) =>
        new Promise<void>((resolve) =>
          server.close(() => {
            resolve();
          }),
        ),
    ),
  );
});

async function fakeServer(): Promise<string> {
  const server = createServer((request, response) => {
    if (request.url === "/v1/models") {
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ data: [{ id: "fake-model" }] }));
      return;
    }
    if (request.url === "/v1/responses") {
      response.writeHead(200, { "Content-Type": "text/event-stream" });
      response.write('data: {"type":"response.output_text.delta","delta":"Hei"}\n\n');
      response.write('data: {"type":"response.output_text.delta","delta":"!"}\n\n');
      response.end('data: {"type":"response.completed","response":{"id":"r1"}}\n\n');
      return;
    }
    response.statusCode = 404;
    response.end();
  });
  servers.push(server);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as AddressInfo;
  return `http://127.0.0.1:${String(port)}/v1`;
}

describe("synthetic OpenAI transport", () => {
  it("lists models and requires response.completed", async () => {
    const apiBaseUrl = await fakeServer();
    await expect(listModels({ accessToken: "test", apiBaseUrl })).resolves.toEqual(["fake-model"]);
    await expect(
      streamResponse(
        { accessToken: "test", apiBaseUrl },
        { model: "fake-model", input: [{ role: "user", content: "Translate Hello" }] },
      ),
    ).resolves.toMatchObject({ text: "Hei!" });
  });
});
