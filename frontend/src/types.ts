export type TaskType<S extends Status> = {
  id: string;
  status: S;
  title: string;
  description: string;
  assignee: ContactsType | null;
  position: number;
  createdAt: string;
};

export enum Status {
  todo = 'todo',
  doing = 'doing',
  done = 'done'
}

export type ColumnType = {
  [key in Status]: TaskType<key>[];
};

export type ContactsType = {
  email: string;
  firstName: string;
  lastName: string;
};

export type PresentType = {
  id: number;
  left: string;
  rotation: string;
  img: string;
  size: string;
};