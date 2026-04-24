type ErrorMessagePayload = {
  message?: string;
  error?: {
    message?: string;
    data?: {
      error?: {
        message?: string;
      };
    };
    fieldErrors?: Record<string, Array<{ message?: string }>>;
  };
  data?: {
    error?: {
      message?: string;
      fieldErrors?: Record<string, Array<{ message?: string }>>;
    };
  };
};

export function toErrorMessage(payload: ErrorMessagePayload | string | null | undefined) {
  if (!payload) return payload;
  if (typeof payload === 'string') return payload;
  const errorMessage =
    payload?.error?.data?.error?.message ??
    payload?.data?.error?.message ??
    payload?.message ??
    payload?.error ??
    payload;
  const fieldErrors = payload?.error?.fieldErrors ?? payload?.data?.error?.fieldErrors;

  if (fieldErrors) {
    let field: keyof typeof fieldErrors;
    const errors: string[] = [];
    for (field in fieldErrors) {
      errors.push(
        fieldErrors[field]?.reduce((p: string, c: { message?: string }, i: number) => {
          if (i === 0) return c?.message ?? '';
          p += (p.length > 0 ? ' \r\n' : '') + c?.message;
          return p;
        }, ''),
      );
    }
    return `${errorMessage} ${errors.join(' \r\n')}`;
  }
  return errorMessage;
}
