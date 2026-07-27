import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// If you have a global CSS file (like index.css or App.css), keep its import here. 
// For example: import './index.css';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);