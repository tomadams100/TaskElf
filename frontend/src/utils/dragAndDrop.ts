import { ColumnType } from '../App';
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

  const start = columns[sourceDroppableId as keyof typeof columns];
  const end = columns[destDroppableId as keyof typeof columns];

  if (start === end) {
    const newStartList = moveItem(start.list, sourceIndex, destIndex);
    updateColumn(start.id, newStartList, setColumns);
  } else {
    const { newStartList, newEndList } = moveItemBetweenColumns(
      start.list,
      end.list,
      sourceIndex,
      destIndex
    );
    updateColumns(start.id, end.id, newStartList, newEndList, setColumns);
  }

  return null;
};

const moveItem = (list: any[], sourceIndex: number, destIndex: number) => {
  const movedItem = list[sourceIndex];
  const newStartList = [
    ...list.slice(0, sourceIndex),
    ...list.slice(sourceIndex + 1)
  ];
  newStartList.splice(destIndex, 0, movedItem);
  return newStartList;
};

const moveItemBetweenColumns = (
  startList: any[],
  endList: any[],
  sourceIndex: number,
  destIndex: number
) => {
  const movedItem = startList[sourceIndex];
  const newStartList = [
    ...startList.slice(0, sourceIndex),
    ...startList.slice(sourceIndex + 1)
  ];
  const newEndList = [
    ...endList.slice(0, destIndex),
    movedItem,
    ...endList.slice(destIndex)
  ];
  return { newStartList, newEndList };
};

const updateColumn = (
  columnId: string,
  newList: any[],
  setColumns: Props['setColumns']
) => {
  setColumns((state) => ({
    ...state,
    [columnId]: {
      id: columnId,
      list: newList
    }
  }));
};

const updateColumns = (
  startId: string,
  endId: string,
  newStartList: any[],
  newEndList: any[],
  setColumns: Props['setColumns']
) => {
  setColumns((state) => ({
    ...state,
    [startId]: {
      id: startId,
      list: newStartList
    },
    [endId]: {
      id: endId,
      list: newEndList
    }
  }));
};
