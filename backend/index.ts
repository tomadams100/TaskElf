import dotenv from 'dotenv';
dotenv.config();
import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import cors from 'cors';

import { tRCPRouter } from './src/routes';

const app = express();

app.use(
  cors({
    origin: `http://${process.env.BACK_HOST}:${process.env.BACK_PORT}`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  })
);

app.use('/trpc', trpcExpress.createExpressMiddleware({ router: tRCPRouter }));

app.use(express.json());

app.listen(process.env.BACK_PORT, () => {
  console.log(
    `server running : http://${process.env.BACK_HOST}:${process.env.BACK_PORT}`
  );
});

export type AppRouter = typeof tRCPRouter;
