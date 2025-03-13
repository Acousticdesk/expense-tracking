import { nanoid } from "nanoid";
import { axios } from "../axios";

interface PostRegisterPayload {
  username: string;
  password: string;
}

export async function postRegister(payload: PostRegisterPayload) {
  const response = await axios.post(`/auth/register`, payload, {
    headers: addAuthorizationHeader({
      "Content-Type": "application/json",
    }),
  });

  return response.data;
}

interface PostLoginResponse {
  token: string;
}

interface PostLoginPayload {
  username: string;
  password: string;
}

export async function postLogin(payload: PostLoginPayload) {
  const response = await axios.post<PostLoginResponse>(`/auth/login`, payload, {
    headers: addAuthorizationHeader({
      "Content-Type": "application/json",
      "x-device-id": getDeviceId() || generateDeviceId(),
    }),
  });

  return response.data;
}

export function getTokenFromPostLoginResponse(response: PostLoginResponse) {
  return response.token;
}

export function addAuthorizationHeader(headers: Record<string, string>) {
  return {
    ...headers,
    Authorization: `Bearer ${getAccessToken()}`,
  };
}

interface UserProfile {
  id: number;
  username: string;
}

export async function fetchUserProfile() {
  const response = await axios.get<UserProfile>(`/auth/me`, {
    headers: addAuthorizationHeader({}),
  });

  return response.data;
}

export function getUsernameFromUserProfile(userProfile: UserProfile) {
  return userProfile.username;
}

export function getAccessToken() {
  return localStorage.getItem("token");
}

export function setAccessToken(token: string) {
  return localStorage.setItem("token", token);
}

export function removeAccessToken() {
  return localStorage.removeItem("token");
}

export function generateDeviceId() {
  return nanoid();
}

export function getDeviceId() {
  return localStorage.getItem("deviceId");
}

export function setDeviceId(deviceId: string) {
  return localStorage.setItem("deviceId", deviceId);
}
