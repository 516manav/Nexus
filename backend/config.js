import dotenv from "dotenv";

dotenv.config();

const config = {
    PORT: process.env.PORT,
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS, 10),
    SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: parseInt(process.env.DB_PORT, 10),
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
};

export default config;