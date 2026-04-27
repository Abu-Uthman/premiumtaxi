import { getCredentials } from './config.mjs';

const API_ROOT = 'https://api.dataforseo.com/v3';

function redact(message) {
  return String(message || '').replace(/Authorization: Basic [A-Za-z0-9+/=]+/g, 'Authorization: Basic [redacted]');
}

export class DataForSeoClient {
  constructor() {
    const { login, password } = getCredentials();
    this.auth = Buffer.from(`${login}:${password}`).toString('base64');
  }

  async post(endpoint, payload) {
    const response = await fetch(`${API_ROOT}${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(`DataForSEO returned non-JSON response (${response.status}): ${redact(text.slice(0, 500))}`);
    }

    if (!response.ok || json.status_code >= 30000) {
      const message = json.status_message || response.statusText || 'Unknown DataForSEO error';
      throw new Error(`DataForSEO request failed for ${endpoint}: ${json.status_code || response.status} ${redact(message)}`);
    }

    return json;
  }
}

export function extractTasks(apiResponse) {
  return Array.isArray(apiResponse?.tasks) ? apiResponse.tasks : [];
}

export function extractFirstResult(apiResponse) {
  return extractTasks(apiResponse).flatMap((task) => task.result || [])[0] || null;
}
