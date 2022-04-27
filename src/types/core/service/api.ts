export interface APIResponse<T, S = T> extends ResponseJSON<T, S> {
  status: number;
}

export interface ResponseJSON<T, S = T> {
  data: T | S;
  meta: any;
}
