// server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// 1. Initialize our MCP Server identity
const server = new McpServer({
  name: "FreeWeatherServer",
  version: "1.0.0",
});

// 2. Register the weather tool
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

// 3. Connect the server using standard input/output transport channels
const transport = new StdioServerTransport();
await server.connect(transport);