import { Schema, Document } from 'mongoose';

export interface User extends Document {
  full_name: string;
  phone_number: string;
  email: string;
  password: string;
  chat_id: string;
  tg_user_name: string;
}

export const UserSchema = new Schema<User>({
  full_name: { type: String, required: false },
  phone_number: { type: String, required: false },
  email: { type: String, required: false, unique: true },
  password: { type: String, required: false },
  chat_id: { type: String, required: false },
  tg_user_name: { type: String, required: false },
});
