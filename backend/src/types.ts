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
  status: z.nativeEnum(Status),
  title: z.string(),
  description: z.string(),
  assignee: z.string().nullable()
});

export type TaskType<T extends Status> = z.infer<typeof TaskSchema> & {
  status: T;
};

export const TaskSchemaMongoose = new Schema({
  id: { type: String, required: true },
  status: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  assignee: { type: String, default: null }
});

export const TaskModel = mongoose.model<Document & TaskType<Status>>(
  'Task',
  TaskSchemaMongoose
);
