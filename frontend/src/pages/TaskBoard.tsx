import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
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
import * as handlers from './handlers';
import EditPanel from '../components/EditPanel';

export default function TaskBoard() {
  const { isLoading, user } = useAuth0();
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

  const editTaskMutation = trpc.editTask.useMutation();
  const deleteTaskMutation = trpc.deleteTask.useMutation();
  const getTasksQuery = trpc.getTasks.useQuery({ userId: user!.sub! });
  const getContactsQuery = trpc.getContacts.useQuery({ userId: user!.sub! });
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
      fetchedTasks.forEach(() => {
        handlers.addPresent({ setPresents });
      });
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

  if (isLoading) {
    return <div>Loading ...</div>;
  }

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
                  setSelectedTask={setSelectedTask}
                  setTitle={setTitle}
                  setDescription={setDescription}
                  setSelectedContact={setSelectedContact}
                  setSearchTerm={setSearchTerm}
                  setPresents={setPresents}
                  setColumns={setColumns}
                  setTasks={setTasks}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
        <div className="drawer-side z-10">
          <EditPanel
            contacts={contacts}
            description={description ?? ''}
            searchResults={searchResults}
            searchTerm={searchTerm}
            selectedTask={selectedTask ?? null}
            setDescription={setDescription}
            setSearchTerm={setSearchTerm}
            setSelectedContact={setSelectedContact}
            setTasks={setTasks}
            setTitle={setTitle}
            tasks={tasks}
            title={title ?? ''}
            key={selectedTask?.id}
          />
        </div>
      </div>
      <Present presents={presents} />
    </div>
  );
}
