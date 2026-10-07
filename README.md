# AI MCP Data Processing Agent

Learning project by Igor Faustino for experimenting with LangGraph, LangChain, OpenRouter, and MCP tools.

The app receives a natural-language question with CSV data, extracts the intent, lets an agent call tools, stores data in MongoDB, and writes a report file with the result.

## What This Project Explores

- Building a small LangGraph workflow with separate intent and agent nodes
- Using OpenRouter as a LangChain-compatible chat model provider
- Connecting LangChain agents to MCP servers
- Converting CSV input into JSON with a custom tool
- Saving and querying records through a local MongoDB MCP server
- Writing generated reports to the local filesystem through an MCP filesystem server

## Project Status

This is a learning project, not a production-ready service.

Current limitations:

- There is no automated test suite yet.
- `npm start` runs a local demo request from `src/index.ts` instead of starting a long-running API only.
- The demo depends on a valid OpenRouter API key, local MongoDB, and MCP servers started through `npx`.
- Mongo Express uses simple local demo credentials in `docker-compose.yaml`.
- The agent behavior depends on the selected LLM model and tool-calling reliability.

## Requirements

- Node.js `>=24.10.0`
- npm
- Docker and Docker Compose
- An OpenRouter API key

## Setup

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Then set at least:

```env
OPENROUTER_API_KEY=your-openrouter-api-key
```

LangSmith variables are optional unless you want tracing.

## Run The Local Infrastructure

Start MongoDB and Mongo Express:

```bash
npm run docker:infra:up
```

MongoDB runs on `localhost:27017`.

Mongo Express runs on `http://localhost:8081` with the local demo credentials from `docker-compose.yaml`.

## Run The Demo

```bash
npm start
```

The current demo reads `data/sales-complete.csv`, asks the agent to rank the top 5 most sold products, and posts the question to the local `/chat` endpoint.

Generated reports are written under `reports/`.

## Useful Scripts

```bash
npm start                 # Run the demo request
npm run dev               # Run with node --watch and inspector
npm run langgraph:serve   # Start LangGraph dev server
npm run docker:infra:up   # Start MongoDB and Mongo Express
npm run docker:infra:down # Stop local infrastructure
```

## High-Level Flow

1. `src/index.ts` loads sample CSV data and sends a question to `/chat`.
2. `src/server.ts` receives the request and invokes the LangGraph graph.
3. `intentNode` extracts intent, file content, and file name from the user message.
4. `agentNode` builds a tool-aware prompt and asks the LLM to complete the workflow.
5. MCP tools provide filesystem and MongoDB access.
6. `csv_to_json` converts CSV text into JSON for the agent workflow.

## Main Files

- `src/graph/graph.ts` defines the LangGraph pipeline.
- `src/graph/nodes/intentNode.ts` parses the user intent.
- `src/graph/nodes/agentNode.ts` runs the tool-using agent step.
- `src/services/openRouterService.ts` configures the LangChain agent and OpenRouter client.
- `src/services/mcpService.ts` wires MCP tools into the agent.
- `src/tools/` contains local tool configuration and the CSV-to-JSON tool.
- `data/` contains sample CSV files.
- `reports/` contains generated report examples.

## Verification

Type-check the project with:

```bash
npx tsc --noEmit
```

## Notes

This repository is intentionally small and explicit so it is easier to study. Some parts are hard-coded for the demo, including the sample CSV file and the analytical question in `src/index.ts`.
