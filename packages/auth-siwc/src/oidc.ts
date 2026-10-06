export interface OidcValidationInput {
  idToken: string;
  nonce: string;
  clientId: string;
  issuer: string;
  jwksUri: string;
  now?: Date;
}

export interface ValidatedIdentity {
  subject: string;
  email?: string;
  name?: string;
}

export type OidcValidator = (input: OidcValidationInput) => Promise<ValidatedIdentity>;

// Intentionally no JWT implementation lives here. The SIWC spike must add a
// reviewed browser-compatible JOSE implementation and verify signature, issuer,
// audience, expiry, and nonce against current OpenAI discovery metadata.
