import { ColumnType, Status, TaskType } from '../App';
import { DropResult } from 'react-beautiful-dnd';

type Props = {
  dropResult: DropResult;
  columns: ColumnType;
  setColumns: React.Dispatch<React.SetStateAction<ColumnType>>;
};

export const onDragEnd = (props: Props) => {
  const { dropResult, columns, setColumns } = props;
  const { source, destination } = dropResult;
  if (!destination) return null;

  const { droppableId: sourceDroppableId, index: sourceIndex } = source;
  const { droppableId: destDroppableId, index: destIndex } = destination;

  if (sourceDroppableId === destDroppableId && sourceIndex === destIndex) {
    return null;
  }

  const start = columns[sourceDroppableId as Status];
  const end = columns[destDroppableId as Status];

  if (start === end) {
    const newStartTasks = moveTask(start, sourceIndex, destIndex);

    setColumns((state) => ({ ...state, [sourceDroppableId]: newStartTasks }));
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
  }

  return null;
};

const moveTask = (
  tasks: TaskType<Status>[],
  sourceIndex: number,
  destIndex: number
) => {
  const movedItem = tasks[sourceIndex];
  const newStartTasks = [
    ...tasks.slice(0, sourceIndex),
    ...tasks.slice(sourceIndex + 1)
  ];
  newStartTasks.splice(destIndex, 0, movedItem);
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
