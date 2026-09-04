export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.message = message;
    this.details = details;
    this.name = 'ApiError';
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const apiClient = {
  async fetch(endpoint, options= {}) {
    const url = `${API_URL}${endpoint}`;
    
    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      throw new ApiError(
        response.status,
        errorData.message || 'Error en la petición',
        errorData
      );
    }

    if (response.status === 204) {
      return {};
    }
    
    return response.json();
  },

  get(endpoint, options= {}) {
    return this.fetch(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, data, options= {}) {
    return this.fetch(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  patch(endpoint, data, options= {}) {
    return this.fetch(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  put(endpoint, data, options= {}) {
    return this.fetch(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint, options= {}) {
    return this.fetch(endpoint, { ...options, method: 'DELETE' });
  },
};
