import { registerAs } from "@nestjs/config";

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET,
  issuer: process.env.JWT_ISSUER,
}));