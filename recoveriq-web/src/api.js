const API_URL = import.meta.env.VITE_API_URL;

function redirectToLoginOnAuthFailure() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Can't reach the server. If it's been idle, it may take up to a minute to wake up — please try again."
    );
  }

  if (response.status === 401) {
    // Token missing/expired/invalid — don't leave the user stuck on a broken screen.
    const isLoginAttempt = path === "/api/auth/login";
    if (!isLoginAttempt) {
      redirectToLoginOnAuthFailure();
    }
    let errorMessage = "Invalid username or password.";
    try {
      const body = await response.json();
      if (body.message) errorMessage = body.message;
    } catch {
      // no JSON body
    }
    throw new Error(errorMessage);
  }

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    try {
      const errorBody = await response.json();
      if (errorBody.message) errorMessage = errorBody.message;
    } catch {
      // response had no JSON body, keep default message
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function login(username, password) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function getRunbooks() {
  return apiFetch("/api/runbook");
}

export async function getRunbook(id) {
  return apiFetch(`/api/runbook/${id}`);
}

export async function createRunbook(data) {
  return apiFetch("/api/runbook", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateRunbook(id, data) {
  return apiFetch(`/api/runbook/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteRunbook(id) {
  return apiFetch(`/api/runbook/${id}`, {
    method: "DELETE",
  });
}

export async function generateDrill(runbookId, assignToUserId) {
  return apiFetch("/api/drill/generate", {
    method: "POST",
    body: JSON.stringify({ runbookId, assignToUserId }),
  });
}

export async function getDrills() {
  return apiFetch("/api/drill");
}

export async function getDrill(id) {
  return apiFetch(`/api/drill/${id}`);
}

export async function respondToStep(drillId, stepId, responseText) {
  return apiFetch(`/api/drill/${drillId}/steps/${stepId}/respond`, {
    method: "POST",
    body: JSON.stringify({ responseText }),
  });
}

export async function getTeamMembers() {
  return apiFetch("/api/users/team-members");
}
