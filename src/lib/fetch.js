// src/lib/fetch.js
const API_URL = decodeURIComponent(import.meta.env.VITE_API_URL);
const HEADER_AUTH_TOKEN = import.meta.env.VITE_HEADER_AUTH_TOKEN;

function buildQueryString(params) {
    return Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
}

function buildHeaders(apiKey) {
    return {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${HEADER_AUTH_TOKEN}`,
        "X-Client-Version": "1.0.0",
        ...(apiKey && { "x-api-key": apiKey })
    };
}

export async function get(endpoint, params = {}, apiKey) {
    if (params) {
        endpoint += '?' + buildQueryString(params);
    }
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: buildHeaders(apiKey)
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return response.json();
}

export async function post(endpoint, data, params = {}, apiKey) {
    if (params) {
        endpoint += '?' + buildQueryString(params);
    }
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: buildHeaders(apiKey),
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return response.json();
}