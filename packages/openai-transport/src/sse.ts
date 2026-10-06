export interface SseMessage {
  event?: string;
  data: string;
}

function decodeEvent(block: string): SseMessage | undefined {
  let event: string | undefined;
  const data: string[] = [];
  for (const line of block.split(/\r?\n/u)) {
    if (!line || line.startsWith(":")) continue;
    const separator = line.indexOf(":");
    const field = separator === -1 ? line : line.slice(0, separator);
    let value = separator === -1 ? "" : line.slice(separator + 1);
    if (value.startsWith(" ")) value = value.slice(1);
    if (field === "event") event = value;
    if (field === "data") data.push(value);
  }
  if (data.length === 0) return undefined;
  return event === undefined ? { data: data.join("\n") } : { event, data: data.join("\n") };
}

export async function* parseSseStream(
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<SseMessage> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    for (;;) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      let boundary = buffer.search(/\r?\n\r?\n/u);
      while (boundary !== -1) {
        const block = buffer.slice(0, boundary);
        const separator = /^\r?\n\r?\n/u.exec(buffer.slice(boundary))?.[0] ?? "\n\n";
        buffer = buffer.slice(boundary + separator.length);
        const message = decodeEvent(block);
        if (message) yield message;
        boundary = buffer.search(/\r?\n\r?\n/u);
      }
      if (done) break;
    }
    const trailing = decodeEvent(buffer.trim());
    if (trailing) yield trailing;
  } finally {
    reader.releaseLock();
  }
}
