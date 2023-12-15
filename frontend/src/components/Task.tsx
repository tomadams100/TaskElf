import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

export default function Task(args: {
  task: { id: string; content: string };
  index: number;
}) {
  const { task, index } = args;
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-gray-200 rounded-lg p-2 transition duration-800 ease-out hover:bg-white mt-2"
        >
          {task.content}
        </div>
      )}
    </Draggable>
  );
}
