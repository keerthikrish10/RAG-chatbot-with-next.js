import React, { useState } from "react";
import UrlInput from "./components/UrlInput";
import Chat from "./components/chat";

function App() {
  const [urls, setUrls] = useState([]);

  return (
    <div className="app-container">
      <h1>RAG Chatbot</h1>
      <UrlInput setUrls={setUrls} />
      <Chat />
    </div>
  );
}

export default App;
