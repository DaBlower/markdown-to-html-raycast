import { Detail, Clipboard } from "@raycast/api";
import { useEffect, useState } from "react";
import { marked } from 'marked';

export default function Command() {
  const [text, setText] = useState("Getting contents of your clipboard...");
  const [html, setHtml] = useState("")

  useEffect(() => {
    let cancelled = false; // cleanup if the command closes before finishing
    (async () => {
      try {
        const t = await Clipboard.readText();
        if (!cancelled) {
          const trimmedText = t?.trim() ?? "Clipboard is empty or not text";
          setText(trimmedText)
          if (trimmedText && trimmedText !== "Clipboard is empty or not text") { // if text exists, then convert it with marked
            const convertedHtml = await marked(trimmedText)
            setHtml(convertedHtml)
            Clipboard.copy(convertedHtml)
          }
        }
      }
      catch {
        if (!cancelled) setText("Failed to read clipboard");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);
  
  return <Detail markdown={`# Clipboard\n\n${text}\n\n# HTML Output\n\n\`\`\`\n${html}\`\`\``} />;
}