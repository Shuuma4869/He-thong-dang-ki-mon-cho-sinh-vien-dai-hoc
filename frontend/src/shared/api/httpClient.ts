import { ApiError } from '@/shared/api/apiError';

export interface HttpRequestOptions extends RequestInit {
  baseUrl?: string;
}

export async function requestJson<TResponse>(
  path: string,
  options: HttpRequestOptions = {}
): Promise<TResponse> {
  const { baseUrl = '', headers, ...requestOptions } = options;
  const response = await fetch(`${baseUrl}${path}`, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  if (!response.ok) {
    throw new ApiError('Yêu cầu API thất bại.', response.status);
  }

  return response.json() as Promise<TResponse>;
}
