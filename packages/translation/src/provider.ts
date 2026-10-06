import type { Segment } from "@glotterfly/dom";

export interface TranslationPageContext {
  title?: string;
  sourceLanguage?: string;
  targetLanguage: string;
}

export interface TranslationRequest {
  page: TranslationPageContext;
  segments: readonly Segment[];
  signal?: AbortSignal;
}

export interface TranslatedSegment {
  id: string;
  text: string;
}

export interface TranslationResult {
  segments: readonly TranslatedSegment[];
}

export interface TranslationProvider {
  translate(request: TranslationRequest): Promise<TranslationResult>;
}

export class FakeTranslationProvider implements TranslationProvider {
  translate(request: TranslationRequest): Promise<TranslationResult> {
    request.signal?.throwIfAborted();
    return Promise.resolve({
      segments: request.segments.map((segment) => ({
        id: segment.id,
        text: `[${request.page.targetLanguage}] ${segment.text}`,
      })),
    });
  }
}
