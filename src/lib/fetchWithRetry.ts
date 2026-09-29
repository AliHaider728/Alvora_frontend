export interface FetchWithRetryOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
  retryMethods?: string[];
}

export async function fetchWithRetry(url: string | URL | Request, options: FetchWithRetryOptions = {}): Promise<Response> {
  const maxRetries = options.retries ?? 3;
  const timeoutMs = options.timeout ?? 10000;
  const retryMethods = options.retryMethods ?? ['GET', 'HEAD'];
  
  // Extract method from request object or options
  let method = 'GET';
  if (options.method) {
    method = options.method.toUpperCase();
  } else if (url instanceof Request) {
    method = url.method.toUpperCase();
  }

  const shouldRetry = retryMethods.includes(method);
  let attempt = 0;
  let lastError: Error | undefined;

  while (attempt <= maxRetries) {
    let controller: AbortController | undefined;
    let timeoutId: NodeJS.Timeout | undefined;
    let fetchOptions = { ...options };

    if (!options.signal) {
      controller = new AbortController();
      fetchOptions.signal = controller.signal;
      timeoutId = setTimeout(() => controller!.abort(), timeoutMs);
    }

    try {
      const response = await fetch(url, fetchOptions);
      if (timeoutId) clearTimeout(timeoutId);

      const isRetryableStatus = [408, 425, 429, 500, 502, 503, 504].includes(response.status);
      
      if (!isRetryableStatus || attempt >= maxRetries || !shouldRetry) {
        return response;
      }

      if (process.env.NODE_ENV === 'development') {
        console.warn(`[fetchWithRetry] Attempt ${attempt + 1} failed with status ${response.status} for ${url}. Retrying...`);
      }

      let delay = (options.retryDelay ?? 500) * Math.pow(2, attempt) + Math.random() * 100;
      
      const retryAfter = response.headers.get('Retry-After');
      if (retryAfter) {
        const parsed = parseInt(retryAfter, 10);
        if (!isNaN(parsed)) {
          delay = parsed * 1000;
        } else {
          const date = new Date(retryAfter).getTime();
          if (!isNaN(date)) {
            delay = Math.max(0, date - Date.now());
          }
        }
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
    } catch (err: any) {
      if (timeoutId) clearTimeout(timeoutId);
      lastError = err;

      const isNetworkOrTimeout = err.name === 'AbortError' || err.name === 'TypeError' || err.message?.includes('fetch failed');

      if (!isNetworkOrTimeout || attempt >= maxRetries || !shouldRetry) {
        if (attempt >= maxRetries && isNetworkOrTimeout) {
          throw new Error(`[fetchWithRetry] Request failed after ${maxRetries} retries: ${err.message}`);
        }
        throw err;
      }

      if (process.env.NODE_ENV === 'development') {
        console.warn(`[fetchWithRetry] Attempt ${attempt + 1} failed due to network/timeout (${err.message}) for ${url}. Retrying...`);
      }

      let delay = (options.retryDelay ?? 500) * Math.pow(2, attempt) + Math.random() * 100;
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
    }
  }

  throw lastError || new Error(`[fetchWithRetry] Request failed for ${url}`);
}
