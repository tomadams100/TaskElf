export type TaskType<S extends Status> = {
  id: string;
  status: S;
  title: string;
  description: string;
  assignee: string | null;
  position: number;
};

export enum Status {
  todo = 'todo',
  doing = 'doing',
  done = 'done'
}

export type ColumnType = {
  [key in Status]: TaskType<key>[];
};
