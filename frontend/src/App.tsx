import { useState } from 'react';
import Column from './components/Column';
import { DragDropContext } from 'react-beautiful-dnd';
import * as dragAndDrop from './utils/dragAndDrop';

export type TaskType<S extends Status> = {
  id: string;
  status: S;
  title: string;
  description: string;
  assignee: string | null;
};

export enum Status {
  todo = 'todo',
  doing = 'doing',
  done = 'done'
}

export type ColumnType = {
  [key in Status]: TaskType<key>[];
};

const tasksFromDb: TaskType<Status>[] = [
  {
    id: '1',
    status: Status.todo,
    title: 'Task 1',
    description: 'This is task 1',
    assignee: null
  },
  {
    id: '2',
    status: Status.doing,
    title: 'Task 2',
    description: 'This is task 2',
    assignee: null
  },
  {
    id: '3',
    status: Status.done,
    title: 'Task 3',
    description: 'This is task 3',
    assignee: null
  }
];

function App() {
  const [tasks, setTasks] = useState<TaskType<Status>[]>(tasksFromDb);
  const [columns, setColumns] = useState<ColumnType>({
    [Status.todo]: tasks.filter(
      (t) => t.status === Status.todo
    ) as TaskType<Status.todo>[],
    [Status.doing]: tasks.filter(
      (t) => t.status === Status.doing
    ) as TaskType<Status.doing>[],
    [Status.done]: tasks.filter(
      (t) => t.status === Status.done
    ) as TaskType<Status.done>[]
  });
  const [selectedTask, setSelectedTask] = useState<TaskType<Status>>();
  const [title, setTitle] = useState<string>();

  const onAddTask = (s: Status) => {
    const newTask: TaskType<Status> = {
      id: Math.random().toString(),
      status: s,
      assignee: null,
      description: '',
      title: 'New Task'
    };
    setTasks((state) => [...state, newTask]);
    setColumns((state) => {
      return {
        ...state,
        [s]: [...state[s], newTask]
      };
    });
  };

  function onEditTask(args: {
    taskId: string;
    data: Partial<TaskType<Status>>;
  }) {
    const { taskId, data } = args;

    const task = tasks.find((t) => t.id === taskId);

    if (!task) return;

    if (data.title) {
      task.title = data.title;
    } else if (data.description) {
      task.description = data.description;
    } else if (data.assignee) {
      task.assignee = data.assignee;
    }

    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    tasks[taskIndex] = task;
    setTasks([...tasks]);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedTask && title) {
      onEditTask({ taskId: selectedTask.id, data: { title } });
    }
  };

  return (
    <>
      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <DragDropContext
            onDragEnd={(e) =>
              dragAndDrop.onDragEnd({ columns, setColumns, dropResult: e })
            }
          >
            <div className="flex justify-center mt-10">
              {Object.values(Status).map((Status) => (
                <Column
                  status={Status}
                  tasks={columns[Status]}
                  key={Status}
                  onAddTask={onAddTask}
                  setSelectedTask={setSelectedTask}
                  setTitle={setTitle}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <form onSubmit={handleSubmit}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
