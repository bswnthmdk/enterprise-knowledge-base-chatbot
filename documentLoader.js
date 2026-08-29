import fs from "fs"; // built-in module used to read the PDF file
import { PDFParse } from "pdf-parse";
import { Document } from "@langchain/core/documents"; // to store the extracted text and metadata
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// Create embeddings for the chunks using Google Generative AI Embeddings
const embeddings = await new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: process.env.GEMINI_API_KEY,
});

// Function that loads a PDF file and converts it into a LangChain Document
export async function documentLoader(filePath) {
  const dataBuffer = fs.readFileSync(filePath); // Read the PDF file as a Buffer

  const parser = new PDFParse({ data: dataBuffer }); // Create a PDF parser using the PDF file data

  const pdfData = await parser.getText(); // Extract text from the PDF

  // Create a LangChain Document from the extracted PDF text
  const document = new Document({
    pageContent: pdfData.text, // Store the extracted PDF text as the document content
    // Store additional information about the document
    metadata: {
      source: filePath,
    },
  });

  await parser.destroy(); // Release resources used by the PDF parser

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500, // Define the character size of each chunk of text
    chunkOverlap: 0, // Define the character overlap between chunks of text
  });

  const chunks = await splitter.splitDocuments([document]); // Split the document into smaller chunks

  console.log("No of chunks:", chunks.length); // Display the LangChain Documents
  console.log(chunks);
}
