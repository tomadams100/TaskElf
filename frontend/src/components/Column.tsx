import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';
interface ColumnProps {
  col: { id: string; list: { id: string; content: string }[] };
  onAddTask: (colId: string) => void;
}

export default function Column(args: ColumnProps) {
  const { col, onAddTask } = args;
  const { id, list } = col;

  const handleAddTask: React.MouseEventHandler<HTMLDivElement> = (event) => {
    onAddTask(id);
  };

  return (
    <div className="w-1/3 p-4">
      <div className="bg-gray-200 p-2">
        <h2 className="text-lg font-semibold">{id}</h2>
        <Droppable droppableId={id}>
          {(provided) => (
            <div
              className="p-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {list.map((task, index) => (
                <Task key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div
          className="bg-blue-500 text-white rounded p-2 mt-2 cursor-pointer"
          onClick={handleAddTask}
        >
          Add
        </div>
      </div>
    </div>
  );
}
