import { useEffect, useState } from 'react';
import * as uuid from 'uuid';
import Column from '.././components/Column';
import { DragDropContext } from 'react-beautiful-dnd';
import * as dragAndDrop from '.././utils/dragAndDrop';
import {
  Status,
  TaskType,
  ColumnType,
  ContactsType,
  PresentType
} from '../types';
import { trpc } from '../trpc';
import NavBar from '../components/NavBar';
import Present from '../components/Present';

export default function TaskBoard() {
  const [tasks, setTasks] = useState<TaskType<Status>[]>([]);
  const [contacts, setContacts] = useState<ContactsType[]>([]);
  const [columns, setColumns] = useState<ColumnType>({
    [Status.todo]: tasks.filter(
      (t) => t.status === Status.todo
    ) as TaskType<Status.todo>[],
    [Status.doing]: tasks.filter(
      (t) => t.status === Status.doing
    ) as TaskType<Status.doing>[],
    [Status.done]: tasks.filter(
      (t) => t.status === Status.done
    ) as TaskType<Status.done>[]
  });
  const [selectedTask, setSelectedTask] = useState<TaskType<Status>>();
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ContactsType[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactsType | null>(
    null
  );
  const [presents, setPresents] = useState<PresentType[]>([]);
  function addPresent() {
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

  const addTaskMutation = trpc.addTask.useMutation();
  const editTaskMutation = trpc.editTask.useMutation();
  const deleteTaskMutation = trpc.deleteTask.useMutation();
  const getTasksQuery = trpc.getTasks.useQuery();
  const getContactsQuery = trpc.getContacts.useQuery();
  const addContactMutation = trpc.addContact.useMutation();

  useEffect(() => {
    const fetchedTasks = getTasksQuery.data as TaskType<Status>[];
    if (fetchedTasks) {
      setTasks(fetchedTasks);
      setColumns({
        [Status.todo]: fetchedTasks
          .filter((t) => t.status === Status.todo)
          .sort((a, b) => a.position - b.position) as TaskType<Status.todo>[],
        [Status.doing]: fetchedTasks
          .filter((t) => t.status === Status.doing)
          .sort((a, b) => a.position - b.position) as TaskType<Status.doing>[],
        [Status.done]: fetchedTasks
          .filter((t) => t.status === Status.done)
          .sort((a, b) => a.position - b.position) as TaskType<Status.done>[]
      });

      setPresents([]);
      for (const task of fetchedTasks) {
        addPresent();
      }
    }
  }, [getTasksQuery.data, deleteTaskMutation.isSuccess]);

  useEffect(() => {
    const fetchedContacts = getContactsQuery.data as ContactsType[];
    if (fetchedContacts) {
      setContacts(fetchedContacts);
    }
  }, [getContactsQuery.data, addContactMutation.isSuccess]);

  useEffect(() => {
    const results = contacts.filter((contact) =>
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, contacts]);

  const onAddTask = (s: Status) => {
    const newTask: TaskType<Status> = {
      id: uuid.v4(),
      status: s,
      assignee: null,
      description: '',
      title: 'New Task',
      position: columns[s].length,
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
    addPresent();
  };

  function onEditTask(args: {
    taskId: string;
    data: Partial<TaskType<Status>>;
  }) {
    const { taskId, data } = args;

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedTask) {
      onEditTask({
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
  };

  const handleDelete = () => {
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
  };

  return (
    <div className="bg-gradient-to-r from-rose-800 to-lime-800 h-screen">
      <NavBar />
      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <DragDropContext
            onDragEnd={(e) =>
              dragAndDrop.onDragEnd({
                columns,
                setColumns,
                dropResult: e,
                editTaskMutation
              })
            }
          >
            <div className="flex justify-center mt-10">
              {Object.values(Status).map((Status) => (
                <Column
                  status={Status}
                  tasks={columns[Status]}
                  key={Status}
                  onAddTask={onAddTask}
                  setSelectedTask={setSelectedTask}
                  setTitle={setTitle}
                  setDescription={setDescription}
                  setSelectedContact={setSelectedContact}
                  setSearchTerm={setSearchTerm}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
        <div className="drawer-side z-10">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="menu p-4 w-80 min-h-full bg-base-200 backdrop-blur bg-white/50 text-base-content space-y-5">
            <h3 className="text-2xl">Edit Task</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <label htmlFor="title" className="italic text-sm">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input w-full max-w-xs"
              />
              <div className="divider" />
              <label htmlFor="description" className="italic text-sm">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                className="textarea textarea-bordered textarea-md w-full max-w-xs"
                maxLength={100}
              />
              <div className="divider" />
              <label htmlFor="assignee" className="italic text-sm">
                Assignee
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm &&
                searchResults.length > 0 &&
                !searchResults.find(
                  (contact) => contact.email === searchTerm
                ) && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded">
                    {searchResults.map((contact) => (
                      <div
                        key={contact.email}
                        className="p-2 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedContact(contact);
                          setSearchTerm(contact.email);
                        }}
                      >
                        {contact.email}
                      </div>
                    ))}
                  </div>
                )}
              <input className="btn bg-green-500" type="submit" value="Save" />
            </form>
            <div
              className="btn bg-red-500"
              onClick={handleDelete}
              aria-label="close sidebar"
            >
              Delete
            </div>
          </div>
        </div>
      </div>
      <Present presents={presents} />
    </div>
  );
}
