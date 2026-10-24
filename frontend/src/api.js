const TOKEN_KEY = "ge_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function api(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Token ${token}`;

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && token) {
    clearToken();
    window.location.href = "/login";
    throw new Error("Session expirée");
  }
  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data.detail ||
      Object.entries(data)
        .map(([k, v]) => `${k} : ${Array.isArray(v) ? v.join(" ") : v}`)
        .join(" | ") ||
      "Erreur serveur";
    throw new Error(msg);
  }
  return data;
}
