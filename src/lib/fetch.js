// src/lib/fetch.js
const API_URL = decodeURIComponent(import.meta.env.VITE_API_URL.trim());

function buildQueryString(params) {
    return Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
}

export async function get(endpoint, params={}) {
    if (params) {
        endpoint += '?' + buildQueryString(params);
    }
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
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
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return response.json();
}