/**
 * Production / standalone API entry — listens on PORT (default 4000).
 */
import { AppConfig } from "./patterns/singleton/AppConfig.js";
import { createLmsApp } from "./createLmsApp.js";

const config = AppConfig.getInstance();
const app = createLmsApp();

app.listen(config.port, () => {
  console.log(`LMS API listening on http://localhost:${config.port}${config.apiPrefix}`);
});

