import { LRUCache } from "lru-cache";
import jwt from "jsonwebtoken";
import { Response } from "express";

interface User {
  id: number;
  username: string;
  password: string;
}

export interface DecodedUserToken {
  id: number;
  expires: number;
}

export function getUserPassword(user: User) {
  return user.password;
}

export function getUserId(user: User) {
  return user.id;
}

export interface DecodedRefreshToken {
  userId: User["id"];
  deviceId: string;
}

interface RefreshTokenLRUEntry {
  userId: User["id"];
  deviceId: string;
  refreshToken: string;
}

export const refreshTokenLRU = new LRUCache<string, RefreshTokenLRUEntry[]>({
  max: 500,
  ttl: 1000 * 60 * 60 * 24 * 30,
});

function generateAccessToken(userId: User["id"]) {
  return jwt.sign(
    { id: userId, expires: Date.now() + 15 * 60 * 1000 },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "15min",
    },
  );
}

// todo akicha: use a different secret for the refresh token
function generateRefreshToken(userId: User["id"], deviceId: string) {
  return jwt.sign(
    { userId: userId, deviceId },
    process.env.JWT_SECRET as string,
  );
}

interface CreateRefreshTokenLRUEntry {
  userId: User["id"];
  refreshToken: string;
  deviceId: string;
}

function createRefreshTokenLRUEntry({
  userId,
  refreshToken,
  deviceId,
}: CreateRefreshTokenLRUEntry) {
  return {
    userId,
    refreshToken,
    deviceId,
  };
}

interface InvalidateRefreshTokenLRUEntryParams {
  userId: User["id"];
  deviceId: string;
}

function invalidateRefreshTokenLRUEntry({
  userId,
  deviceId,
}: InvalidateRefreshTokenLRUEntryParams) {
  const existingRefreshTokens = refreshTokenLRU.get(String(userId));

  refreshTokenLRU.set(
    String(userId),
    existingRefreshTokens
      ? existingRefreshTokens.filter((entry) => entry.deviceId !== deviceId)
      : [],
  );
}

interface FindRefreshTokenLRUEntryParams {
  userId: User["id"];
  refreshToken: string;
  deviceId: string;
}

export function findRefreshTokenLRUEntry({
  userId,
  refreshToken,
  deviceId,
}: FindRefreshTokenLRUEntryParams) {
  const existingRefreshTokens = refreshTokenLRU.get(String(userId));

  return existingRefreshTokens?.find(
    (entry) =>
      entry.deviceId === deviceId && entry.refreshToken === refreshToken,
  );
}

interface SetRefreshTokenLRUEntryParams {
  userId: User["id"];
  deviceId: string;
  refreshTokenLRUEntry: RefreshTokenLRUEntry;
}

function setRefreshTokenLRUEntry({
  userId,
  refreshTokenLRUEntry,
}: SetRefreshTokenLRUEntryParams) {
  const existingRefreshTokens = refreshTokenLRU.get(String(userId));

  refreshTokenLRU.set(
    String(userId),
    existingRefreshTokens
      ? [...existingRefreshTokens, refreshTokenLRUEntry]
      : [refreshTokenLRUEntry],
  );
}

interface GenerateTokensParams {
  userId: User["id"];
  deviceId: string;
}

export function generateTokens({ userId, deviceId }: GenerateTokensParams) {
  const token = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId, deviceId);

  const refreshTokenLRUEntry = createRefreshTokenLRUEntry({
    userId,
    refreshToken,
    deviceId,
  });

  invalidateRefreshTokenLRUEntry({
    userId,
    deviceId,
  });

  setRefreshTokenLRUEntry({
    userId,
    deviceId,
    refreshTokenLRUEntry,
  });

  return {
    token,
    refreshToken,
  };
}

export function attachRefreshTokenToResponse(
  res: Response,
  refreshToken: string,
) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: !process.env.IS_DEV,
    sameSite: "strict",
    path: "/refresh-token",
  });
}

export function getUserIdFromDecodedRefreshToken(
  decodedRefreshToken: DecodedRefreshToken,
) {
  return decodedRefreshToken.userId;
}

export function getDeviceIdFromDecodedRefreshToken(
  decodedRefreshToken: DecodedRefreshToken,
) {
  return decodedRefreshToken.deviceId;
}
