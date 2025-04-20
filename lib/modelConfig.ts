import { createMistral } from "@ai-sdk/mistral";

const fetchData = async () => {
  const response = await fetch("http://localhost:11434/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: safeStringify({
      model: "mistral-7b",
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    const error = await response.text();
    throw new Error(`Ollama Error: ${error}`);
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
};

const mistral = createMistral({
  fetch: fetchData,

  baseURL: "http://localhost:11434/v1/chat/completions",
});

export const mistralChat = mistral.chat("open-mistal-7b");
