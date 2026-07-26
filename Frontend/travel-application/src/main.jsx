import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// 1. Import BrowserRouter
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 2. Wrap the App component inside BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
