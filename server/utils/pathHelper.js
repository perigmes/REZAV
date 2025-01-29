import { fileURLToPath } from "url";
import path from "path";

// Exporter __dirname et __filename
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
