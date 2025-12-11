import { API_BASE } from "../config/api";

export async function postJSON(path, body, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  
  try {
    const res = await fetch(`${API_BASE}/${path}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });
    return await res.json();
  } catch (error) {
    console.error("API Error", error);
    return { success: false, message: "Network Error" };
  }
}

export async function getJSON(path, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  
  try {
    const res = await fetch(`${API_BASE}/${path}`, { method: "GET", headers });
    return await res.json();
  } catch (error) {
    console.error("API Error", error);
    return { success: false, message: "Network Error" };
  }
}