import {
  MessagesAnnotation,
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
import readline from "node:readline/promises";

dotenv.config();

const llmModel = new ChatGroq({
  model: "llama-3.1-8b-instant",
  temperature: 0,
});

const callModel = async (state) => {
  console.log("Calling LLM Model");
  const response = await llmModel.invoke(state.messages);

  return {
    messages: [response],
  };
};

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge(START, "agent")
  .addEdge("agent", END);

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
        messages: [{ role: "user", content: user_query }],
      },
      {
        configurable: { threadId: id },
      }
    );

    const lastMessage = result.messages[result.messages.length - 1];
    console.log("AI:", lastMessage.content);
  }
};

main();