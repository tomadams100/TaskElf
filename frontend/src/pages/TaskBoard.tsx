import { useEffect, useState } from 'react';
import Column from '.././components/Column';
import { DragDropContext } from 'react-beautiful-dnd';
import * as dragAndDrop from '.././utils/dragAndDrop';
import { Status, TaskType, ColumnType } from '../types';
import { trpc } from '../trpc';

export default function TaskBoard() {
  const [tasks, setTasks] = useState<TaskType<Status>[]>([]);
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

  const addTaskMutation = trpc.addTask.useMutation();
  const editTaskMutation = trpc.editTask.useMutation();
  const deleteTaskMutation = trpc.deleteTask.useMutation();
  const getTasksQuery = trpc.getTasks.useQuery();

  useEffect(() => {
    const fetchedTasks = getTasksQuery.data as TaskType<Status>[];
    if (fetchedTasks) {
      setTasks(fetchedTasks);
      setColumns({
        [Status.todo]: fetchedTasks
          .filter((t) => t.status === Status.todo)
          .sort((a, b) => a.position - b.position) as TaskType<Status.todo>[],
        [Status.doing]: fetchedTasks
          .filter((t) => t.status === Status.doing)
          .sort((a, b) => a.position - b.position) as TaskType<Status.doing>[],
        [Status.done]: fetchedTasks
          .filter((t) => t.status === Status.done)
          .sort((a, b) => a.position - b.position) as TaskType<Status.done>[]
      });
    }
  }, [getTasksQuery.data, deleteTaskMutation.isSuccess]);

  const onAddTask = (s: Status) => {
    const newTask: TaskType<Status> = {
      id: Math.random().toString(),
      status: s,
      assignee: null,
      description: '',
      title: 'New Task',
      position: columns[s].length
    };
    setTasks((state) => [...state, newTask]);
    setColumns((state) => {
      return {
        ...state,
        [s]: [...state[s], newTask]
      };
    });
    addTaskMutation.mutate(newTask);
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
    editTaskMutation.mutate(task);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedTask && title) {
      onEditTask({ taskId: selectedTask.id, data: { title } });
    }
  };

  const handleDelete = () => {
    if (selectedTask) {
      const taskIndex = tasks.findIndex((t) => t.id === selectedTask.id);
      tasks.splice(taskIndex, 1);
      setTasks([...tasks]);
      deleteTaskMutation.mutate(selectedTask);
    }
  };

  return (
    <>
      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <DragDropContext
            onDragEnd={(e) =>
              dragAndDrop.onDragEnd({
                columns,
                setColumns,
                dropResult: e,
                editTaskMutation
              })
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
            <div className="btn" onClick={handleDelete}>
              Delete
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
