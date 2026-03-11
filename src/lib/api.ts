const rawBaseUrl =
  (import.meta as any).env?.VITE_BASEURL ||
  (import.meta as any).env?.BASEURL ||
  (import.meta as any).env?.VITE_API_BASE ||
  'http://localhost:4000';

export const BASEURL = String(rawBaseUrl).replace(/\/+$/, '');
export const API_BASE_URL = `${BASEURL}/api`;

export const apiUrl = (path: string) =>
  `${API_BASE_URL}/${path.replace(/^\/+/, '')}`;
