import { createServer } from "node:http";

const port = 4000;

const server = createServer((request, response) => {
  if (request.url === "/api/health" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ status: "running" }));
    return;
  }

  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, () => {
  console.log(`CookieGuard backend listening on http://localhost:${port}`);
});
