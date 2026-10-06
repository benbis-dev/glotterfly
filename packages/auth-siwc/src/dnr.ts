import { OAUTH_RULE_ID } from "./constants";

export interface DnrApi {
  isRegexSupported(input: {
    regex: string;
    isCaseSensitive?: boolean;
    requireCapturing?: boolean;
  }): Promise<{ isSupported: boolean; reason?: string }>;
  updateSessionRules(input: {
    removeRuleIds?: number[];
    addRules?: {
      id: number;
      priority: number;
      action: { type: "redirect"; redirect: { regexSubstitution: string } };
      condition: { regexFilter: string; resourceTypes: ["main_frame"] };
    }[];
  }): Promise<void>;
}

export function callbackRegex(port: number): string {
  if (!Number.isInteger(port) || port < 1 || port > 65_535)
    throw new Error("Invalid callback port");
  return `^http://127\\.0\\.0\\.1:${String(port)}/auth/callback(\\?.*)?$`;
}

export async function installLoopbackIntercept(
  dnr: DnrApi,
  port: number,
  extensionCallbackUrl: string,
): Promise<void> {
  const regexFilter = callbackRegex(port);
  const support = await dnr.isRegexSupported({
    regex: regexFilter,
    isCaseSensitive: true,
    requireCapturing: true,
  });
  if (!support.isSupported) {
    throw new Error(`OAuth callback regex unsupported: ${support.reason ?? "unknown"}`);
  }

  await dnr.updateSessionRules({
    removeRuleIds: [OAUTH_RULE_ID],
    addRules: [
      {
        id: OAUTH_RULE_ID,
        priority: 10_000,
        action: {
          type: "redirect",
          redirect: { regexSubstitution: `${extensionCallbackUrl}\\1` },
        },
        condition: { regexFilter, resourceTypes: ["main_frame"] },
      },
    ],
  });
}

export async function removeLoopbackIntercept(dnr: DnrApi): Promise<void> {
  await dnr.updateSessionRules({ removeRuleIds: [OAUTH_RULE_ID] });
}
