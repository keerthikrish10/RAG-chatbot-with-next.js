import React, { useState } from "react";

const UrlInput = ({ setUrls }) => {
  const [input, setInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;

    const res = await fetch("http://localhost:3000/api/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: input }),
    });

    const data = await res.json();

    if (data.message) {
      setUrls((prev) => [...prev, input]);
      setInput("");
      console.log(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="url-form">
      <input
        type="text"
        placeholder="Enter URL"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="input-box"
      />
      <button type="submit" className="btn">Scrape</button>
    </form>
  );
};

export default UrlInput;
