import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import { ColumnType, PresentType, Status, TaskType } from '../types';
import { ContactsType } from '../../../backend/src/types';
import * as handlers from '../pages/handlers';
import { trpc } from '../trpc';
import * as uuid from 'uuid';
import { useAuth0 } from '@auth0/auth0-react';
interface Args {
  status: Status;
  tasks: TaskType<Status>[];
  setSelectedTask: React.Dispatch<
    React.SetStateAction<TaskType<Status> | undefined>
  >;
  setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDescription: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSelectedContact: React.Dispatch<React.SetStateAction<ContactsType | null>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setPresents: React.Dispatch<React.SetStateAction<PresentType[]>>;
  setTasks: React.Dispatch<React.SetStateAction<TaskType<Status>[]>>;
  setColumns: React.Dispatch<React.SetStateAction<ColumnType>>;
}

export default function Column(args: Args) {
  const {
    status,
    tasks,
    setSelectedTask,
    setTitle,
    setDescription,
    setSelectedContact,
    setSearchTerm,
    setPresents,
    setTasks,
    setColumns
  } = args;
  const { user } = useAuth0();
  const addTaskMutation = trpc.addTask.useMutation();

  return (
    <div className="w-1/3 p-4">
      <div className="bg-gray-200 p-2 rounded-lg">
        <h2 className="text-lg font-semibold">
          {status[0].toUpperCase() + status.slice(1)}
        </h2>
        <Droppable droppableId={status}>
          {(provided) => (
            <div
              className="p-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks.map((task, index) => {
                return (
                  <label
                    htmlFor="my-drawer-4"
                    onClick={() => {
                      setSelectedTask(task);
                      setTitle(task.title);
                      setDescription(task.description);
                      setSelectedContact(task.assignee);
                      setSearchTerm(task.assignee?.email || '');
                    }}
                  >
                    <Task key={task.id} task={task} index={index} />
                  </label>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div
          className="bg-transparent p-2 mt-2 text-gray-600 cursor-pointer rounded-lg hover:bg-gray-300
        "
          onClick={() => {
            const newTask: TaskType<Status> = {
              id: uuid.v4(),
              status,
              assignee: null,
              description: '',
              title: 'New Task',
              position: tasks.length,
              createdAt: new Date().toISOString(),
              userId: user!.sub!
            };
            setTasks((state) => [...state, newTask]);
            setColumns((state) => {
              return {
                ...state,
                [status]: [...state[status], newTask]
              };
            });

            addTaskMutation.mutate(newTask);
            handlers.addPresent({ setPresents });
          }}
        >
          Add a task
        </div>
      </div>
    </div>
  );
}
