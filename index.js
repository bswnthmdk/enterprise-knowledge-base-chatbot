import { config } from "dotenv";
config(); // Load environment variables from .env file

import { documentLoader } from "./documentLoader.js";

const filePath = "documents\\cg-internal-docs.pdf";
documentLoader(filePath);
