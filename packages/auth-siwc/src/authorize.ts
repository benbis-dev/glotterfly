import { OPENAI_RESOURCE, SIWC_SCOPES } from "./constants";
import type { AuthorizationTransaction } from "./transaction";

export interface AuthorizationUrlInput {
  authorizationEndpoint: string;
  agentName: string;
  transaction: AuthorizationTransaction;
}

export function buildAuthorizationUrl(input: AuthorizationUrlInput): URL {
  const { authorizationEndpoint, agentName, transaction } = input;
  const url = new URL(authorizationEndpoint);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", transaction.clientId);
  url.searchParams.set("redirect_uri", transaction.redirectUri);
  url.searchParams.set("scope", SIWC_SCOPES.join(" "));
  url.searchParams.set("resource", OPENAI_RESOURCE);
  url.searchParams.set("state", transaction.state);
  url.searchParams.set("nonce", transaction.nonce);
  url.searchParams.set("code_challenge", transaction.challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("agent_name_hint", agentName);
  url.searchParams.set("ext_agent_host_id", transaction.hostId);
  return url;
}
