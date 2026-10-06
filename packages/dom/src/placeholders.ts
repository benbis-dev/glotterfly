const PLACEHOLDER_PATTERN =
  /https?:\/\/[^\s]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|\$\{[^}]+\}|\{\{[^}]+\}\}|%[sdif]|\{\d+\}/gu;

export interface ProtectedText {
  text: string;
  placeholders: ReadonlyMap<string, string>;
}

export function protectPlaceholders(
  source: string,
  salt = crypto.randomUUID().slice(0, 8),
): ProtectedText {
  const placeholders = new Map<string, string>();
  let index = 0;
  const text = source.replace(PLACEHOLDER_PATTERN, (match) => {
    const token = `GLT_PH_${salt}_${String(index++)}`;
    placeholders.set(token, match);
    return token;
  });
  return { text, placeholders };
}

export function restorePlaceholders(
  translated: string,
  placeholders: ReadonlyMap<string, string>,
): string {
  let restored = translated;
  for (const [token, original] of placeholders) {
    const occurrences = restored.split(token).length - 1;
    if (occurrences !== 1) throw new Error(`Placeholder ${token} was not preserved exactly once`);
    restored = restored.replace(token, original);
  }
  return restored;
}
