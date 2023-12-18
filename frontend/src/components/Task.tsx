import { Draggable } from 'react-beautiful-dnd';
import { Status, TaskType } from '../types';
import moment from 'moment';

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
          <h1>{task.title}</h1>
          <p className="text-xs text-gray-600">
            <span className="italic">
              Created at {moment(task.createdAt).format('MMM Do')}
            </span>
            {task.assignee?.email && (
              <>
                {' '}
                | <span className="italic">{task.assignee.email}</span>
              </>
            )}
          </p>
        </div>
      )}
    </Draggable>
  );
}
