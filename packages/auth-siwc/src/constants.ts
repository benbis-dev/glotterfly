export const DYNAMIC_AGENT_CLIENT_ID = "dynamic_agent_client";
export const OPENAI_RESOURCE = "https://api.openai.com/v1";
export const REQUIRED_DIRECT_SCOPE = "chatgpt.tokens.use.direct";
export const SIWC_SCOPES = [
  "openid",
  "profile",
  "email",
  "offline_access",
  "resource.invoke",
  REQUIRED_DIRECT_SCOPE,
] as const;
export const OAUTH_RULE_ID = 7001;
