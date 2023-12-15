import { useState } from 'react';
import Column from './components/Column';
import { DragDropContext } from 'react-beautiful-dnd';
import * as dragAndDrop from './utils/dragAndDrop';

export type ColumnType = {
  [key: string]: { id: string; list: { id: string; content: string }[] };
};

function App() {
  const initialColumns: ColumnType = {
    todo: {
      id: 'todo',
      list: [
        { id: 'item-1', content: 'Task 1' },
        { id: 'item-2', content: 'Task 2' },
        { id: 'item-3', content: 'Task 3' }
      ]
    },
    doing: {
      id: 'doing',
      list: []
    },
    done: {
      id: 'done',
      list: []
    }
  };
  const [columns, setColumns] = useState(initialColumns);

  const onAddTask = (colId: string) => {
    const newTask = {
      id: Math.random().toString(),
      content: 'New Task'
    };
    setColumns((state) => ({
      ...state,
      [colId]: {
        id: colId,
        list: [...columns[colId as keyof typeof columns].list, newTask]
      }
    }));
  };

  return (
    <DragDropContext
      onDragEnd={(e) =>
        dragAndDrop.onDragEnd({ columns, setColumns, dropResult: e })
      }
    >
      <div className="flex justify-center mt-10">
        {Object.values(columns).map((col) => (
          <Column col={col} key={col.id} onAddTask={onAddTask} />
        ))}
      </div>
    </DragDropContext>
  );
}

export default App;
