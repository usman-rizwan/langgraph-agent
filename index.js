import {
  MessagesAnnotation,
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
import readline from "node:readline/promises";
import { TavilySearch } from "@langchain/tavily";
import { ToolNode } from "@langchain/langgraph/prebuilt";

dotenv.config();

const webSearchTool = new TavilySearch({
  topic: "general",
  maxResults: 3,
});
const tools = [webSearchTool];

const llmModel = new ChatGroq({
  model: "llama-3.1-8b-instant",
  temperature: 0,
}).bindTools(tools);

const callModel = async (state) => {
  console.log("Calling LLM Model");
  const response = await llmModel.invoke(state.messages);
  return { messages: [response] };
};

const toolNode = new ToolNode(tools);

function shouldContinue(state) {
  const lastMessage = state.messages.at(-1);
  if (lastMessage?.tool_calls?.length > 0) return "tools";
  return END;
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge(START, "agent")
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue);

const app = workflow.compile();

const main = async (id = "1") => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Chat started (type 'exit' to quit)");

  while (true) {
    const user_query = await rl.question("You: ");
    if (user_query.toLowerCase() === "exit") {
      rl.close();
      break;
    }

    const result = await app.invoke(
      {
        messages: [
          {
            role: "system",
            content: `
    You are a strict assistant.
    Only use tools when the user asks for:
    - current weather
    - latest news
    - real-time data
    For other questions, answer directly without tools.
`,
          },

          { role: "user", content: user_query },
        ],
      },
      { configurable: { threadId: id } }
    );

    const lastMessage = result.messages[result.messages.length - 1];
    console.log("AI:", lastMessage.content);
  }
};

main();
