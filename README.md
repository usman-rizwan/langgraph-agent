# LangGraph Agent

A conversational AI agent powered by LangChain and LangGraph that combines language models with web search capabilities.

## Overview

This project implements an agentic workflow using LLaMA 3.1 (via Groq) with integrated web search functionality through Tavily. The agent can engage in multi-turn conversations and dynamically search the web when needed.

## Features

- **Conversational AI**: Interactive chat interface with memory of conversation history
- **Web Search Integration**: Uses Tavily API to search the web for up-to-date information
- **LangGraph Workflow**: State-based graph architecture for managing agent logic
- **Tool Integration**: Seamlessly combines LLM responses with external tool calls

## Installation

```bash
pnpm install
```

## Setup

1. Create a `.env` file in the root directory with your API keys:

```
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
```

2. Get your API keys:
   - [Groq API](https://groq.com)
   - [Tavily API](https://tavily.com)

## Usage

```bash
node index.js
```

The agent will start an interactive conversation. Type your questions and the agent will respond, using web search when necessary.

## Technology Stack

- **LangChain**: LLM framework and tools
- **LangGraph**: State machine and workflow orchestration
- **Groq**: Fast inference for LLaMA 3.1 model
- **Tavily**: Web search API

## License

ISC
