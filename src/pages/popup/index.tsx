import { createRoot } from "react-dom/client";
import "@pages/popup/index.css";
import "@assets/styles/tailwind.css";
import Popup from "@pages/popup/Popup";
import { NAME } from "@src/constants";

function init() {
  const rootContainer = document.querySelector("#__root");
  if (!rootContainer) {
    throw new Error(`Can't find ${NAME} Popup root element`);
  }
  const root = createRoot(rootContainer);
  root.render(<Popup />);
}

init();
