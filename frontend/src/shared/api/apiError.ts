export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly errorCode?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message || 'Yeu cau API that bai.';
  }

  if (error instanceof TypeError) {
    return 'Khong the ket noi den may chu backend. Vui long kiem tra backend dang chay.';
  }

  if (error instanceof Error) {
    return error.message || 'Da co loi xay ra.';
  }

  return 'Da co loi xay ra.';
}
