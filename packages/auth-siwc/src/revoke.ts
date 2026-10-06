export interface RevocationRequest {
  revocationEndpoint: string;
  token: string;
  clientId: string;
}

export async function revokeToken(
  request: RevocationRequest,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const body = new URLSearchParams({ token: request.token, client_id: request.clientId });
  const response = await fetchImpl(request.revocationEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) throw new Error(`Token revocation failed with HTTP ${String(response.status)}`);
}
