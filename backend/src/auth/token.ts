import jwt from "jsonwebtoken";

/**
 * Create a new token with the hashed ID
 * @param id - The hashed ID
 * @returns The token
 */
export default function createSecretToken(id: string) {
  const expiresIn = process.env.TOKEN_EXPIRY || "7d";
  
  return jwt.sign({ id }, process.env.TOKEN_KEY as any, {
    expiresIn: expiresIn as any,
  });
}