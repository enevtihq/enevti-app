export interface APIResponse<T> extends ResponseJSON<T> {
  status: number;
}

export interface ResponseJSON<T> {
  data: T | Record<string, any>;
  meta: any;
}
