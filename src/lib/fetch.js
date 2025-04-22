// src/lib/fetch.js
const API_URL = decodeURIComponent(import.meta.env.VITE_API_URL.trim());
const HEADER_AUTH_TOKEN = import.meta.env.VITE_HEADER_AUTH_TOKEN.trim();

function buildQueryString(params) {
    return Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
}

const headers = 
{
    'Content-Type': 'application/json',
    "Authorization": `Bearer ${HEADER_AUTH_TOKEN}`,
    "x-api-key":"2a8b9a42-b720c1cb",
};

export async function get(endpoint, params={}) {
    if (params) {
        endpoint += '?' + buildQueryString(params);
    }
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: headers
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return response.json();
}

export async function post(endpoint, data, params={}) {
    if (params) {
        endpoint += '?' + buildQueryString(params);
    }
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return response.json();
}