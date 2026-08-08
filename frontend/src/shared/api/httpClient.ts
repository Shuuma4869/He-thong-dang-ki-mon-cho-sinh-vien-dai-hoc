import { ApiError } from '@/shared/api/apiError';

export interface HttpRequestOptions extends RequestInit {
  baseUrl?: string;
}

export interface ApiResponseEnvelope<TData> {
  success: boolean;
  message: string;
  data: TData;
}

export interface ApiErrorEnvelope {
  success: boolean;
  message: string;
  errorCode: string;
  timestamp: string;
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

  const body = await parseJsonSafely(response);

  if (!response.ok) {
    const errorBody = body as Partial<ApiErrorEnvelope> | undefined;
    throw new ApiError(
      errorBody?.message ?? 'Yêu cầu API thất bại.',
      response.status,
      errorBody?.errorCode,
      errorBody
    );
  }

  return body as TResponse;
}

export async function requestApi<TData>(
  path: string,
  options: HttpRequestOptions = {}
): Promise<TData> {
  const envelope = await requestJson<ApiResponseEnvelope<TData>>(path, options);

  if (!envelope.success) {
    throw new ApiError(envelope.message);
  }

  return envelope.data;
}

async function parseJsonSafely(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return undefined;
  }

  return response.json();
}
