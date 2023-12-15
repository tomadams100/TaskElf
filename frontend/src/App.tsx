import { useState } from 'react';
import Column from './components/Column';
import { DragDropContext } from 'react-beautiful-dnd';
import * as dragAndDrop from './utils/dragAndDrop';

export type TaskType = {
  id: string;
  content: string;
};

enum ColumnTitle {
  todo = 'todo',
  doing = 'doing',
  done = 'done'
}

export type ColumnType = {
  [key in ColumnTitle]: {
    id: string;
    list: TaskType[];
  };
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
  const [selectedTask, setSelectedTask] = useState<Record<string, TaskType>>();
  const [title, setTitle] = useState<string>();

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

  const onEditTask = (colId: string, taskId: string, newContent: string) => {
    console.log({
      colId,
      taskId,
      newContent
    });
    setColumns((state) => ({
      ...state,
      [colId]: {
        id: colId,
        list: columns[colId as keyof typeof columns].list.map((task) =>
          task.id === taskId ? { ...task, content: newContent } : task
        )
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedTask && title) {
      const colId = Object.keys(selectedTask)[0];
      const taskId = selectedTask[colId].id;
      onEditTask(colId, taskId, title);
    }
  };

  return (
    <>
      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <DragDropContext
            onDragEnd={(e) =>
              dragAndDrop.onDragEnd({ columns, setColumns, dropResult: e })
            }
          >
            <div className="flex justify-center mt-10">
              {Object.values(columns).map((col) => (
                <Column
                  col={col}
                  key={col.id}
                  onAddTask={onAddTask}
                  setSelectedTask={setSelectedTask}
                  setTitle={setTitle}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <form onSubmit={handleSubmit}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {/* <p>{selectedTask?.[0].content} is selected</p> */}

              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
