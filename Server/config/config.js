import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
    throw new Error("MongoDB connection URI is not set in environment variables (MONGODB_URI or MONGO_URI).");
}

const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: mongoUri,
    JWT_SECRET: process.env.JWT_SECRET || 'notecraft_dev_secret_key_2026',
    EMAIL_USER: process.env.EMAIL_USER || '',
    EMAIL_PASS: process.env.EMAIL_PASS || '',
    EMAIL_FROM: process.env.EMAIL_FROM || process.env.EMAIL_USER || process.env.GOOGLE_USER || 'no-reply@notecraft.io',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN || '',
    GOOGLE_USER: process.env.GOOGLE_USER || '',
};

export default config;