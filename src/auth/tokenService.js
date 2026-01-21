export const setTokens = (access, refresh) => {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
};

export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh");

  const res = await fetch("https://api.timebus.in/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh })
  });

  const data = await res.json();
  localStorage.setItem("access", data.accessToken);
  return data.accessToken;
};
