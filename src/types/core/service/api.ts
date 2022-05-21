export interface APIResponse<T, S = T> extends ResponseJSON<T, S> {
  status: number;
}

export interface ResponseJSON<T, S = T> {
  data: T | S;
  meta: unknown;
}

export interface ResponseVersioned<T, S = T> {
  checkpoint: number;
  version: number;
  data: T | S;
}

export type APIResponseVersioned<T, S = T> = APIResponse<ResponseVersioned<T, S>>;
