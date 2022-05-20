export interface APIResponse<T, S = T> extends ResponseJSON<T, S> {
  status: number;
}

export interface ResponseJSON<T, S = T> {
  data: T | S;
  meta: any;
}

export interface ResponseVersioned<T, S = T> {
  checkpoint: number;
  version: number;
  data: T | S;
}

export interface APIResponseVersioned<T, S = T> extends APIResponse<ResponseVersioned<T, S>> {}
