import App from "./app.js";
import "./style.css";

const root = document.getElementById("app");
new App(root);

// react 应用
import React from "react";
import ReactDOM from "react-dom/client";
import ReactNoteApp from "./react-app/ReactNoteApp";

ReactDOM.createRoot(document.getElementById("react-app")!).render(
    <React.StrictMode>
        <ReactNoteApp />
    </React.StrictMode>
);
