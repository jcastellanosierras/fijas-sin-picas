interface SuccessResult<T> {
  data: T;
  error: null;
}

interface ErrorResult {
  data: null;
  error: Error;
}

export type Result<T> = SuccessResult<T> | ErrorResult;
