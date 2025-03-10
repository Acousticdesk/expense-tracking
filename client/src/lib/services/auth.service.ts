interface PostRegisterPayload {
  username: string;
  password: string;
}

export async function postRegister(payload: PostRegisterPayload) {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: addAuthorizationHeader({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to register user");
  }
}

interface PostLoginResponse {
  token: string;
}

interface PostLoginPayload {
  username: string;
  password: string;
}

export async function postLogin(payload: PostLoginPayload) {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: addAuthorizationHeader({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  return response.json() as Promise<PostLoginResponse>;
}

export function getTokenFromPostLoginResponse(response: PostLoginResponse) {
  return response.token;
}

export function addAuthorizationHeader(headers: Record<string, string>) {
  return {
    ...headers,
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}
