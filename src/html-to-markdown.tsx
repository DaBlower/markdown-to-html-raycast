import { Detail, Clipboard } from "@raycast/api";
import {useEffect, useState } from "react";

export default function Command() {
  const [text, setText] = useState("Getting contents of your clipboard...");

  useEffect(() => {
    let cancelled = false; // cleanup if the command closes before finishing
    (async () => {
      try {
        // Add delay to see the loading message
        await new Promise(resolve => setTimeout(resolve, 1000));
        const t = await Clipboard.readText();
        if (!cancelled) setText(t ?? "Clipboard is empty or not text");
      }
      catch {
        if (!cancelled) setText("Failed to read clipboard");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);
  
  return <Detail markdown={`# Clipboard\n\n${text}`} />;
}