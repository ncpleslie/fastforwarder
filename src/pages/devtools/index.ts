import { logger } from "@src/utils/logger";
import Browser from "webextension-polyfill";

Browser.devtools.panels
  .create("Dev Tools", "icon32.png", "src/pages/devtools/index.html")
  .catch(logger.error);
