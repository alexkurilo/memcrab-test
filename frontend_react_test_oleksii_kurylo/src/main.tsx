import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import ModalProvider from "./providers/ModalProvider.tsx";
import TableProvider from "./providers/TableProvider.tsx";
import { App } from "./App.tsx";

import "./index.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModalProvider>
      <TableProvider>
        <App />
      </TableProvider>
    </ModalProvider>
  </StrictMode>,
)
