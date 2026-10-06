# SIWC feasibility spike

This is the first post-bootstrap engineering slice and a hard go/no-go gate for a browser-only production architecture.

## Scope

Build only enough functionality to prove:

1. first authorization with `dynamic_agent_client`;
2. exact-port loopback callback interception using a session-scoped Manifest V3 `declarativeNetRequest` rule;
3. query preservation into `oauth-callback.html`;
4. state/nonce/PKCE and issued-client handling;
5. ID-token verification using a reviewed browser-compatible JOSE implementation and current OpenAI discovery metadata;
6. browser-session-only credential handling for the experiment;
7. `GET /v1/models` with the OAuth token;
8. one streamed `POST /v1/responses` request using `store: false` and `stream: true` that reaches `response.completed`.

Do not add webpage translation code to this slice beyond one literal test string.

## Pass matrix

| Test                                        | Expected result                                                                  |
| ------------------------------------------- | -------------------------------------------------------------------------------- |
| First sign-in with `dynamic_agent_client`   | Callback contains a usable code and issued client registration.                  |
| DNR interception                            | No loopback connection-refused page; callback arrives in extension page.         |
| Query preservation                          | `code`, `state`, and first-registration `client_id` survive the rewrite.         |
| Wrong or missing state                      | Immediate rejection; no token exchange.                                          |
| Wrong returning client ID                   | Rejected.                                                                        |
| User cancellation                           | Clean error; DNR rule removed.                                                   |
| DNR timeout                                 | Rule removed automatically.                                                      |
| Worker eviction during OAuth                | Transaction remains recoverable for the experiment.                              |
| Token exchange                              | Exact original loopback redirect URI and PKCE verifier work.                     |
| Wrong ID-token nonce/audience/issuer/expiry | Rejected.                                                                        |
| Missing `chatgpt.tokens.use.direct`         | Inference remains disabled.                                                      |
| Model listing                               | Account-visible catalog is returned.                                             |
| Responses request                           | SSE terminates with `response.completed`.                                        |
| Browser restart                             | Experimental session tokens disappear.                                           |
| Reauthorization                             | Uses the issued client ID, not `dynamic_agent_client`.                           |
| Plan limit                                  | Queue stops/pauses and surfaces a specific usage condition; no blind retry loop. |
| Logout                                      | Renewable session is revoked where supported and local credentials are cleared.  |

## Stop conditions

- If DNR cannot safely preserve callback parameters, try Chrome's documented URL-transform approach once. Do not scrape auth pages, browser history, or navigation internals as a workaround.
- Do not claim browser-only production readiness until OpenAI confirms the DNR interception and memory-only browser-session token design are acceptable.
- If browser token storage is rejected, use a minimal native keychain helper rather than weakening token handling.
