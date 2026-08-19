import fs from "fs";
import { PDFParse } from "pdf-parse";
import { Document } from "@langchain/core/documents";

export async function documentLoader(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: dataBuffer });

  const pdfData = await parser.getText();
  const document = new Document({
    pageContent: pdfData.text,
    metadata: { source: filePath },
  });

  await parser.destroy();
  console.log(document);
}
