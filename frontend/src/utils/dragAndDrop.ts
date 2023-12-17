import { trpc } from '../trpc';
import { Status, TaskType, ColumnType } from '../types';
import { DropResult } from 'react-beautiful-dnd';

type Props = {
  dropResult: DropResult;
  columns: ColumnType;
  setColumns: React.Dispatch<React.SetStateAction<ColumnType>>;
  editTaskMutation: ReturnType<typeof trpc.editTask.useMutation>;
};

export const onDragEnd = (props: Props) => {
  const { dropResult, columns, setColumns, editTaskMutation } = props;
  const { source, destination } = dropResult;
  if (!destination) return null;

  const { droppableId: sourceDroppableId, index: sourceIndex } = source;
  const { droppableId: destDroppableId, index: destIndex } = destination;

  if (sourceDroppableId === destDroppableId && sourceIndex === destIndex) {
    return null;
  }

  const start = columns[sourceDroppableId as Status];
  const end = columns[destDroppableId as Status];

  const movedTask = start[sourceIndex];
  if (start === end) {
    const newStartTasks = moveTask(start, sourceIndex, destIndex);
    setColumns((state) => ({ ...state, [sourceDroppableId]: newStartTasks }));
    for (const task of newStartTasks) {
      editTaskMutation.mutate({
        ...task,
        position: newStartTasks.indexOf(task)
      });
    }
  } else {
    const { newStartTasks, newEndTasks } = moveTaskBetweenColumns(
      start,
      end,
      destDroppableId as Status,
      sourceIndex,
      destIndex
    );
    setColumns((state) => ({
      ...state,
      [sourceDroppableId]: newStartTasks,
      [destDroppableId]: newEndTasks
    }));
    for (const task of newStartTasks) {
      editTaskMutation.mutate({
        ...task,
        position: newStartTasks.indexOf(task)
      });
    }
    for (const task of newEndTasks) {
      editTaskMutation.mutate({
        ...task,
        position: newEndTasks.indexOf(task)
      });
    }
  }

  return null;
};

const moveTask = (
  tasks: TaskType<Status>[],
  sourceIndex: number,
  destIndex: number
) => {
  const movedTask = tasks[sourceIndex];
  const newStartTasks = [
    ...tasks.slice(0, sourceIndex),
    ...tasks.slice(sourceIndex + 1)
  ];
  newStartTasks.splice(destIndex, 0, movedTask);
  return newStartTasks;
};

const moveTaskBetweenColumns = (
  startTasks: TaskType<Status>[],
  endTasks: TaskType<Status>[],
  endStatus: Status,
  sourceIndex: number,
  destIndex: number
) => {
  const movedItem = startTasks[sourceIndex];
  movedItem.status = endStatus;
  const newStartTasks = [
    ...startTasks.slice(0, sourceIndex),
    ...startTasks.slice(sourceIndex + 1)
  ];
  const newEndTasks = [
    ...endTasks.slice(0, destIndex),
    movedItem,
    ...endTasks.slice(destIndex)
  ];
  return { newStartTasks, newEndTasks };
};
