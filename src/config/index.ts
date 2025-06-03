import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  ip_address: process.env.IP_ADDRESS,
  database_url: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  strip_secret_key: process.env.STRIPE_SECRET_KEY,
  server_url: process.env.SERVER_URL!,
  open_ai_api_key: process.env.OPENAI_API_KEY!,
  database_user_name: process.env.MONGODB_ADMINUSERNAME!,
  databse_user_password: process.env.MONGODB_ADMINPASSWORD!,
  database_name: process.env.DATABASE_NAME!,
  database_port: process.env.MONGODB_PORT!,
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME!,
    api_key: process.env.CLOUD_API_KEY!,
    api_secret: process.env.CLOUD_API_SECRET!
  },
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    jwt_expire_in: process.env.JWT_EXPIRE_IN,
  },
  nodemailer:{
    email_user: process.env.EMAIL_USER,
    email_pass: process.env.EMAIL_PASS,
    email_host: process.env.EMAIL_HOST,
    email_port: process.env.EMAIL_PORT,
    email_from: process.env.EMAIL_FROM,
  },
  email: {
    from: process.env.EMAIL_FROM,
    user: process.env.EMAIL_USER,
    port: process.env.EMAIL_PORT,
    host: process.env.EMAIL_HOST,
    pass: process.env.EMAIL_PASS,
  },
  super_admin: {
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
  },
};
