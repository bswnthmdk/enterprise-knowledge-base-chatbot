import "dotenv/config.js";

import { documentLoader } from "./documentLoader.js";

const filePath = "documents\\cg-internal-docs.pdf";
documentLoader(filePath);
