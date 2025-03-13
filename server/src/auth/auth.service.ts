import { LRUCache } from "lru-cache";
import jwt from "jsonwebtoken";

interface User {
  id: number;
  username: string;
  password: string;
}

export interface DecodedUserToken {
  id: number;
}

export function getUserPassword(user: User) {
  return user.password;
}

export function getUserId(user: User) {
  return user.id;
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
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "15min",
  });
}

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
