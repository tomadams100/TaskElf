import { publicProcedure, trpcRouter } from '../../trpc';
import dbSvc from '../dbSvc';
import { TaskModel, TaskSchema } from '../types';

export const tRCPRouter = trpcRouter({
  addTask: publicProcedure.input(TaskSchema).mutation(async (opts) => {
    const task = opts.input;
    await dbSvc.create({ model: TaskModel, data: task });
    return task;
  }),
  editTask: publicProcedure.input(TaskSchema).mutation(async (opts) => {
    const task = opts.input;
    const existingTask = await dbSvc.get({
      model: TaskModel,
      taskId: task.id
    });
    await dbSvc.update({
      _id: existingTask?._id,
      model: TaskModel,
      data: task
    });
    return task;
  }),
  deleteTask: publicProcedure.input(TaskSchema).mutation(async (opts) => {
    const task = opts.input;
    const existingTask = await dbSvc.get({
      model: TaskModel,
      taskId: task.id
    });
    await dbSvc.delete({
      _id: existingTask?._id,
      model: TaskModel
    });
    return task;
  }),
  getTasks: publicProcedure.query(async () => {
    const tasks = await dbSvc.list({ model: TaskModel });
    return tasks;
  })
});
