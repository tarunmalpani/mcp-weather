// remote-server.ts
// Same MCP server as server.ts, exposed over Streamable HTTP instead of stdio,
// so it can be hosted remotely and shared via URL without sharing source code.
import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

function createMcpServer() {
  const server = new McpServer({
    name: "FreeWeatherServer",
    version: "1.0.0",
  });

  server.tool(
    "get_weather",
    "Fetches the current real-time weather and temperature for specific GPS coordinates globally.",
    {
      latitude: z.number().describe("The latitude coordinate of the target location"),
      longitude: z.number().describe("The longitude coordinate of the target location"),
    },
    async ({ latitude, longitude }) => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Open-Meteo API error: ${response.statusText}`);
        }

        const data = await response.json();
        const current = data.current;

        const outputText = `
Current Weather Conditions:
- Temperature: ${current.temperature_2m}°C
- Feels Like: ${current.apparent_temperature}°C
- Humidity: ${current.relative_humidity_2m}%
- Wind Speed: ${current.wind_speed_10m} km/h
        `.trim();

        return {
          content: [{ type: "text", text: outputText }],
        };
      } catch (error: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to fetch weather: ${error.message}` }],
        };
      }
    }
  );

  return server;
}

const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method !== "POST" || req.url !== "/mcp") {
    res.writeHead(404).end();
    return;
  }

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
  });
  const server = createMcpServer();
  await server.connect(transport);
  await transport.handleRequest(req, res);
});

httpServer.listen(PORT, () => {
  console.log(`Weather MCP server listening on http://localhost:${PORT}/mcp`);
});
