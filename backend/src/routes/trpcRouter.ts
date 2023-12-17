import { publicProcedure, trpcRouter } from '../../trpc';

export const tRCPRouter = trpcRouter({
  addTask: publicProcedure.query(async () => {
    console.log('adding a task...');
  }),
  editTask: publicProcedure.query(async () => {
    console.log('editing a task...');
  }),
  deleteTask: publicProcedure.query(async () => {
    console.log('deleting a task...');
  })
});
