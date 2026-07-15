# Weather MCP Server

A simple [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server that exposes a `get_weather` tool. It fetches real-time weather for any GPS coordinates using the free [Open-Meteo](https://open-meteo.com) API — no API key required.

## Requirements

- Node.js **18 or later**. If you use `nvm` and have multiple Node versions installed, make sure a compatible version resolves first in your `PATH`, or point your MCP client config at a specific Node binary (see Usage below).
- No API key or environment variables required.

## Tool

### `get_weather`

Fetches current temperature, feels-like temperature, humidity, and wind speed for a given location.

**Inputs:**
- `latitude` (number) — latitude coordinate of the target location
- `longitude` (number) — longitude coordinate of the target location

## Setup

```bash
git clone https://github.com/tarunmalpani/mcp-weather.git
cd mcp-weather
npm install
```

## Usage

This server communicates over stdio, so it's meant to be launched by an MCP-compatible client, not run standalone.

### Claude Code

Add a `.mcp.json` file in your project root (replace `cwd` with the absolute path where you cloned this repo):

```json
{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["tsx", "server.ts"],
      "cwd": "/absolute/path/to/mcp-weather"
    }
  }
}
```

### Claude Desktop

Add the same `mcpServers` block to your `claude_desktop_config.json` (Settings → Developer → Edit Config).

After saving the config, restart the client. The `get_weather` tool will be available automatically.

## Remote / Hosted Usage

This repo also includes `remote-server.ts`, which exposes the same `get_weather` tool over Streamable HTTP instead of stdio. Deploy it to any Node hosting platform (e.g. [Render](https://render.com)) and clients can connect via URL — no local clone or install needed on the client side.

**Deploying (e.g. on Render):**
- Build Command: `npm install`
- Start Command: `npm run start:remote`
- No environment variables required (the host's `PORT` is picked up automatically)

**Client config, once deployed:**

```json
{
  "mcpServers": {
    "weather": {
      "url": "https://your-deployed-url.example.com/mcp"
    }
  }
}
```

Note: free hosting tiers typically spin down after a period of inactivity, so the first request after idling may take 10-30 seconds while the instance wakes up.

## Development

Run the server directly (useful for testing it starts without errors):

```bash
npm start
```

To run the remote/HTTP variant locally:

```bash
npm run start:remote
```
