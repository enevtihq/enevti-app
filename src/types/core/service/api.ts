export interface ServiceMeta {
  count: number;
  total: number;
  offset?: number;
}

export interface APIResponse<T, S = T, M = unknown> extends ResponseJSON<T, S, M> {
  status: number;
}

export interface ResponseJSON<T, S = T, M = T> {
  data: T | S;
  meta: M;
}

export interface ServiceResponseJSON<T, S = T> {
  data: T | S;
  meta: ServiceMeta;
}

export interface ResponseVersioned<T, S = T> {
  checkpoint: number;
  version: number;
  data: T | S;
}

export type APIResponseVersioned<T, S = T> = APIResponse<ResponseVersioned<T, S>>;

export interface APIResponseVersionRoot<T, V = Record<string, number>> extends APIResponse<T> {
  version: V;
}

export interface APIServiceResponse<T, S = T> extends APIResponse<T, S, ServiceMeta> {
  meta: {
    count: number;
    total: number;
    offset?: number;
  };
}
