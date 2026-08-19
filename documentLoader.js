import fs from "fs"; // built-in module used to read the PDF file
import { PDFParse } from "pdf-parse";
import { Document } from "@langchain/core/documents"; // to store the extracted text and metadata

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

  console.log(document.pageContent); // Display the LangChain Document
}
