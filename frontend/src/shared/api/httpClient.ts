import { ApiError } from '@/shared/api/apiError';
import { API_BASE_URL, FALLBACK_API_BASE_URL } from '@/shared/constants/app';

const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? API_BASE_URL;
const DEFAULT_REQUEST_TIMEOUT_MS = 3000;
const LOCAL_API_FALLBACK_BASE_URLS =
  DEFAULT_API_BASE_URL === API_BASE_URL ? [FALLBACK_API_BASE_URL] : [];

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
  const { baseUrl = DEFAULT_API_BASE_URL, headers, signal, ...requestOptions } = options;
  const baseUrls = [
    baseUrl,
    ...(baseUrl === DEFAULT_API_BASE_URL ? LOCAL_API_FALLBACK_BASE_URLS : []),
  ];
  let lastError: unknown;

  for (const candidateBaseUrl of baseUrls) {
    try {
      return await requestJsonFromBaseUrl<TResponse>(candidateBaseUrl, path, {
        ...requestOptions,
        headers,
        signal,
      });
    } catch (error) {
      lastError = error;
      if (!shouldTryFallback(error)) {
        throw error;
      }
    }
  }

  throw lastError;
}

async function requestJsonFromBaseUrl<TResponse>(
  baseUrl: string,
  path: string,
  options: RequestInit
): Promise<TResponse> {
  const { headers, signal, ...requestOptions } = options;
  const timeoutController = new AbortController();
  const timeoutId = window.setTimeout(() => timeoutController.abort(), DEFAULT_REQUEST_TIMEOUT_MS);
  const abortFromCaller = () => timeoutController.abort(signal?.reason);

  if (signal?.aborted) {
    abortFromCaller();
  } else {
    signal?.addEventListener('abort', abortFromCaller, { once: true });
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...requestOptions,
      signal: timeoutController.signal,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    const body = await parseJsonSafely(response);

    if (!response.ok) {
      const errorBody = body as Partial<ApiErrorEnvelope> | undefined;
      throw new ApiError(
        errorBody?.message ?? 'Yeu cau API that bai.',
        response.status,
        errorBody?.errorCode,
        errorBody
      );
    }

    return body as TResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError' && !signal?.aborted) {
      throw new ApiError(
        'Khong nhan duoc phan hoi tu may chu. Vui long kiem tra backend dang chay.',
        0,
        'NETWORK_TIMEOUT'
      );
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
    signal?.removeEventListener('abort', abortFromCaller);
  }
}

function shouldTryFallback(error: unknown): boolean {
  return error instanceof TypeError
    || (error instanceof ApiError && error.errorCode === 'NETWORK_TIMEOUT');
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
