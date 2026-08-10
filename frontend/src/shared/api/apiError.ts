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
    return error.message || 'Yêu cầu API thất bại.';
  }

  if (error instanceof TypeError) {
    return 'Không thể kết nối đến máy chủ backend. Vui lòng kiểm tra backend đang chạy.';
  }

  if (error instanceof Error) {
    return error.message || 'Đã có lỗi xảy ra.';
  }

  return 'Đã có lỗi xảy ra.';
}
