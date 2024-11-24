import { Schema, Document } from 'mongoose';

export interface ManageStep extends Document {
  chat_id: string;
  step: string;
}

export const ManageStepSchema = new Schema<ManageStep>({
  chat_id: { type: String, required: false },
  step: { type: String, required: false }
});
