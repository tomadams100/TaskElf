import { ColumnType, PresentType, Status, TaskType } from '../types';
import * as uuid from 'uuid';

export function addPresent(args: {
  setPresents: React.Dispatch<React.SetStateAction<PresentType[]>>;
}) {
  const { setPresents } = args;
  const randomPhotoIndex = Math.floor(Math.random() * 3);
  const randomSize = Math.floor(Math.random() * 45 + 45);
  const newPresent: PresentType = {
    id: Date.now(),
    left: `${Math.random() * 90}vw`,
    rotation: `${Math.random() * 150 - 75}deg`,
    img: ['./present.png', './presentBlue.png', './presentRed.png'][
      randomPhotoIndex
    ],
    size: `${randomSize}px`
  };

  setPresents((prevPresents) => [...prevPresents, newPresent]);
}

export function onAddTask(args: {
  s: Status;
  columnsLength: number;
  setTasks: React.Dispatch<React.SetStateAction<TaskType<Status>[]>>;
  setColumns: React.Dispatch<React.SetStateAction<ColumnType>>;
  addTaskMutation: any;
  setPresents: React.Dispatch<React.SetStateAction<PresentType[]>>;
}) {
  const {
    s,
    columnsLength,
    setTasks,
    setColumns,
    addTaskMutation,
    setPresents
  } = args;
  const newTask: TaskType<Status> = {
    id: uuid.v4(),
    status: s,
    assignee: null,
    description: '',
    title: 'New Task',
    position: columnsLength,
    createdAt: new Date().toISOString()
  };
  setTasks((state) => [...state, newTask]);
  setColumns((state) => {
    return {
      ...state,
      [s]: [...state[s], newTask]
    };
  });
  addTaskMutation.mutate(newTask);
  addPresent({ setPresents });
}

export function onEditTask(args: {
  taskId: string;
  data: Partial<TaskType<Status>>;
  tasks: TaskType<Status>[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType<Status>[]>>;
  editTaskMutation: any;
}) {
  const { taskId, data, tasks, editTaskMutation, setTasks } = args;

  const task = tasks.find((t) => t.id === taskId);

  if (!task) return;

  if (data.title) {
    task.title = data.title;
  }
  if (data.description) {
    task.description = data.description;
  }
  if (data.assignee) {
    task.assignee = data.assignee;
  }

  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  tasks[taskIndex] = task;
  setTasks([...tasks]);
  editTaskMutation.mutate(task);
}

export function handleSubmit(args: {
  e: React.FormEvent<HTMLFormElement>;
  title: string;
  description: string;
  searchTerm: string;
  selectedContact: any;
  selectedTask: TaskType<Status> | null;
  contacts: any[];
  editTaskMutation: any;
  addContactMutation: any;
  setTasks: React.Dispatch<React.SetStateAction<TaskType<Status>[]>>;
  tasks: TaskType<Status>[];
}) {
  const {
    e,
    title,
    description,
    searchTerm,
    selectedContact,
    selectedTask,
    contacts,
    addContactMutation,
    editTaskMutation,
    setTasks,
    tasks
  } = args;
  e.preventDefault();
  if (selectedTask) {
    onEditTask({
      editTaskMutation,
      setTasks,
      tasks,
      taskId: selectedTask.id,
      data: {
        ...selectedTask,
        title,
        description,
        assignee:
          selectedContact?.email === searchTerm
            ? selectedContact
            : {
                email: searchTerm,
                firstName: '',
                lastName: ''
              }
      }
    });
  }
  if (!contacts.find((contact) => contact.email === searchTerm)) {
    addContactMutation.mutate({
      email: searchTerm,
      firstName: '',
      lastName: ''
    });
  }
  const drawerCheckbox = document.getElementById(
    'my-drawer-4'
  ) as HTMLInputElement;
  if (drawerCheckbox) {
    drawerCheckbox.checked = false;
  }
}

export function handleDelete(args: {
  selectedTask: TaskType<Status> | null;
  tasks: TaskType<Status>[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType<Status>[]>>;
  deleteTaskMutation: any;
}) {
  const { selectedTask, tasks, setTasks, deleteTaskMutation } = args;
  if (selectedTask) {
    const taskIndex = tasks.findIndex((t) => t.id === selectedTask.id);
    tasks.splice(taskIndex, 1);
    setTasks([...tasks]);
    deleteTaskMutation.mutate(selectedTask);
  }
  const drawerCheckbox = document.getElementById(
    'my-drawer-4'
  ) as HTMLInputElement;
  if (drawerCheckbox) {
    drawerCheckbox.checked = false;
  }
}
