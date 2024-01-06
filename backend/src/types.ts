import { z } from 'zod';
import mongoose, { Document, Model, Schema } from 'mongoose';

export enum Status {
  todo = 'todo',
  doing = 'doing',
  done = 'done'
}

export type ColumnType = {
  [key in Status]: TaskType<key>[];
};

export const TaskSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.nativeEnum(Status),
  title: z.string(),
  description: z.string(),
  assignee: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string()
    })
    .nullable(),
  position: z.number(),
  createdAt: z.string()
});

export type TaskType<T extends Status> = z.infer<typeof TaskSchema> & {
  status: T;
};

export const TaskSchemaMongoose = new Schema({
  id: { type: String, required: true },
  status: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  assignee:
    {
      firstName: { type: String, required: false, default: '' },
      lastName: { type: String, required: false, default: '' },
      email: { type: String, required: false, default: '' }
    } || null,
  position: { type: Number, required: true },
  createdAt: { type: String, default: `${Date.now}` },
  userId: { type: String, required: true }
});

export const TaskModel = mongoose.model<Document & TaskType<Status>>(
  'Task',
  TaskSchemaMongoose
);

export const ContactsSchema = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string()
});

export type ContactsType = z.infer<typeof ContactsSchema>;

export const ContactsSchemaMongoose = new Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: false, default: '' },
  lastName: { type: String, required: false, default: '' }
});

export const ContactsModel = mongoose.model<Document & ContactsType>(
  'Contact',
  ContactsSchemaMongoose
);
