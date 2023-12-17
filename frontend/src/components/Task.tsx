import { Draggable } from 'react-beautiful-dnd';
import { Status, TaskType } from '../types';

export default function Task(args: { task: TaskType<Status>; index: number }) {
  const { task, index } = args;
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-slate-100 rounded-lg p-2 mt-2 shadow-md"
        >
          <p>{task.title}</p>
        </div>
      )}
    </Draggable>
  );
}
