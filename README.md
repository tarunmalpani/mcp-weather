# Weather MCP Server

A simple [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server that exposes a `get_weather` tool. It fetches real-time weather for any GPS coordinates using the free [Open-Meteo](https://open-meteo.com) API — no API key required.

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

## Development

Run the server directly (useful for testing it starts without errors):

```bash
npm start
```
