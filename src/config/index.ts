import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT || 5000,
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRES_IN || "3d",
    jwtRefreshSecret: process.env.REFRESH_TOKEN_SECRET,
    jwtRefreshExpiration: process.env.REFRESH_TOKEN_EXPIRATION || "365d",
  },
};
