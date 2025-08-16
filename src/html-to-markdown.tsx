import { Clipboard, showHUD, closeMainWindow, Detail } from "@raycast/api";
import { useEffect, useState } from "react";
import TurndownService from 'turndown';

export default function Command() {
  const [status, setStatus] = useState("Loading clipboard")
  useEffect(() => {
    // oscillating dots
    const dots = [".", "..", "..."];
    let dotIndex = 0;

    const dotsInterval = setInterval(() =>{
      dotIndex = (dotIndex + 1) % dots.length // modulo wraps it to the length of the dot array
      setStatus(`Loading clipboard${dots[dotIndex]}`)
    }, 300)

    let cancelled = false; // cleanup if the command closes before finishing
    (async () => {
      await new Promise(resolve => setTimeout(resolve, 1250));
      clearInterval(dotsInterval);
      await closeMainWindow({ clearRootSearch: true });
      try {
        const t = await Clipboard.readText();
        if (!cancelled) {
          const trimmedText = t?.trim() ?? "Clipboard is empty or not text";

          if (trimmedText && trimmedText !== "Clipboard is empty or not text") { // if text exists, then convert it with marked
            const turndownService = new TurndownService();
            const convertedMarkdown = turndownService.turndown(trimmedText)

            Clipboard.copy(convertedMarkdown)
            await showHUD("Copied converted Markdown")
          }
          else {
            await showHUD("Clipboard is empty or not text")
          }
        }
      }

      catch {
        if (!cancelled) await showHUD("Failed to read clipboard");
      }
    })();

    return () => {
      clearInterval(dotsInterval);
      cancelled = true;
    };
  }, []);
  
  return <Detail markdown={`# ${status}`}/>;
}