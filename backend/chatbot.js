import Groq from "groq-sdk";
import NodeCache from "node-cache";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

const cache = new NodeCache({ stdTTL: 60 * 60 * 24 }); // Cache for 24 hours (in seconds)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: process.env.GOOGLE_API_KEY,
});

// Pinecone
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

// Connect to existing vectors
const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex: index,
  namespace: "cg-internal-docs",
});

const retriever = vectorStore.asRetriever({ k: 4 }); // Retrieve top 4 relevant chunks

async function firstGroqCall(model, temperature, messages) {
  return groq.chat.completions.create({
    model,
    temperature,
    messages,
  });
}
// Chatbot
export async function chatBot(req, sessionId) {
  const model = "openai/gpt-oss-120b";
  const temperature = 0;
  const systemMessage = {
    role: "system",
    content: `You are a helpful enterprise knowledge assistant.
      Answer the user's question using the provided context.

      Rules:
      - Use the context to answer.
      - Do not make up information.
      - If the answer is not available in the context, say you don't have enough information.
      - Answer concisely.
      - Use simple plain text.`,
  };

  const relevantDocs = await retriever.invoke(req);

  console.log("Retrieved chunks:", relevantDocs.length);

  const context = relevantDocs.map((doc) => doc.pageContent).join("\n\n");
  const userMessage = {
    role: "user",
    content: `
    Context: ${context}
    Question: ${req}`,
  };
  // Get cached conversation if it exists
  const cachedConversation = cache.get(sessionId);

  console.log("Cached conversation:", cachedConversation);

  let messages;

  if (!cachedConversation) {
    messages = [systemMessage, userMessage];
  } else {
    messages = [...cachedConversation, userMessage];
  }

  // 1. First LLM call, don't include the cached conversation
  const response = await firstGroqCall(model, temperature, messages);

  const responseMessage = response.choices[0].message; // Add 1st LLM response to conversation

  messages.push(responseMessage);

  cache.set(sessionId, messages);

  console.log("Saved conversation:", cache.get(sessionId));

  return responseMessage.content;
}
