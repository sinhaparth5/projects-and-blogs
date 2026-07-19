import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const issuer = "projects-and-blogs";
const audience = "projects-and-blogs-admin";

function sessionKey() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || new TextEncoder().encode(secret).byteLength < 32) {
    throw new Error("SESSION_SECRET must contain at least 32 bytes");
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken() {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(sessionKey());
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(token, sessionKey(), {
      algorithms: ["HS256"],
      issuer,
      audience,
      subject: "admin",
    });

    return payload.admin === true;
  } catch {
    return false;
  }
}
