import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import { Status, TaskType } from '../types';
interface Args {
  status: Status;
  tasks: TaskType<Status>[];
  onAddTask: (s: Status) => void;
  setSelectedTask: React.Dispatch<
    React.SetStateAction<TaskType<Status> | undefined>
  >;
  setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function Column(args: Args) {
  const { status, tasks, onAddTask, setSelectedTask, setTitle } = args;

  const handleAddTask: React.MouseEventHandler<HTMLDivElement> = (event) => {
    onAddTask(status);
  };

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
          onClick={handleAddTask}
        >
          Add a task
        </div>
      </div>
    </div>
  );
}
