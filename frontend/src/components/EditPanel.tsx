import { trpc } from '../trpc';
import { ContactsType, Status, TaskType } from '../types';

type Args = {
  selectedTask: TaskType<Status> | null;
  setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDescription: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSelectedContact: React.Dispatch<React.SetStateAction<ContactsType | null>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setTasks: React.Dispatch<React.SetStateAction<TaskType<Status>[]>>;
  tasks: TaskType<Status>[];
  contacts: ContactsType[];
  title: string;
  description: string;
  searchResults: ContactsType[];
};

export default function EditPanel(args: Args) {
  const {
    selectedTask,
    setTitle,
    title,
    description,
    setDescription,
    setSelectedContact,
    searchTerm,
    setSearchTerm,
    searchResults,
    setTasks,
    tasks,
    contacts
  } = args;
  const editTaskMutation = trpc.editTask.useMutation();
  const addContactMutation = trpc.addContact.useMutation();
  const deleteTaskMutation = trpc.deleteTask.useMutation();
  return (
    <>
      <label
        htmlFor="my-drawer-4"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <div className="menu p-4 w-80 min-h-full bg-base-200 backdrop-blur bg-white/50 text-base-content space-y-5">
        <h3 className="text-2xl">Edit Task</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (selectedTask) {
              const task = tasks.find((t) => t.id === selectedTask.id);

              if (!task) return;

              if (title) {
                task.title = title;
              }
              if (description) {
                task.description = description;
              }

              const taskIndex = tasks.findIndex(
                (t) => t.id === selectedTask.id
              );
              tasks[taskIndex] = task;
              setTasks([...tasks]);
              editTaskMutation.mutate(task);
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
          }}
          className="space-y-5"
        >
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
            !searchResults.find((contact) => contact.email === searchTerm) && (
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
          onClick={() => {
            if (selectedTask) {
              const taskIndex = tasks.findIndex(
                (t) => t.id === selectedTask.id
              );
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
          }}
          aria-label="close sidebar"
        >
          Delete
        </div>
      </div>
    </>
  );
}
