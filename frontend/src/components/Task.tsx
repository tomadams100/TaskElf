import { Draggable } from 'react-beautiful-dnd';
import { Status, TaskType } from '../App';

export default function Task(args: { task: TaskType<Status>; index: number }) {
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
          <p>{task.title}</p>
        </div>
      )}
    </Draggable>
  );
}
