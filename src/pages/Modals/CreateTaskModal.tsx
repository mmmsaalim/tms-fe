import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { userService, type User } from "../../services/userService";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
  projectId: number;
  initialData?: any;
}

export default function CreateTaskModal({ open, onClose, onSubmit, projectId, initialData }: CreateTaskModalProps) {
  const [users, setUsers] = useState<User[]>([]);

  const [formData, setFormData] = useState({
    summary: "",
    description: "",
    dueDate: "",
    typeId: 3,
    priorityId: 2,
    statusId: 1,
    assignedToId: "" as string | number
  });

  useEffect(() => {
    if (open && projectId) {
      const fetchProjectUsers = async () => {
        try {
          // CALL THE NEW SERVICE METHOD
          const data = await userService.getProjectUsers(projectId);
          setUsers(data);
        } catch (err) {
          console.error("Failed to load project users:", err);
        }
      };
      fetchProjectUsers();
    }
  }, [open, projectId]);

  useEffect(() => {
    if (open) {
      if (initialData) {

        const getPriorityId = () => {
          if (initialData.priorityId) return initialData.priorityId;
          switch (initialData.priority) {
            case "Highest": return 4;
            case "High": return 3;
            case "Lower": return 1;
            default: return 2;
          }
        };

        const getStatusId = () => {
          if (initialData.statusId) return initialData.statusId;
          switch (initialData.status) {
            case "Done": return 5;
            case "Blocked": return 3;
            case "In Progress": return 2;
            default: return 1;
          }
        };

        const getTypeId = () => {
          if (initialData.typeId) return initialData.typeId;
          switch (initialData.type) {
            case "Sub-task": return 4;
            case "Story": return 2;
            case "Epic": return 1;
            default: return 3;
          }
        };

        let assigneeId = initialData.assignedToId || "";
        if (!assigneeId && initialData.assignedTo && users.length > 0) {
          const foundUser = users.find(u => u.name === initialData.assignedTo);
          if (foundUser) assigneeId = foundUser.id;
        }

        setFormData({
          summary: initialData.summary || "",
          description: initialData.description || "",
          dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : "",
          typeId: getTypeId(),
          priorityId: getPriorityId(),
          statusId: getStatusId(),
          assignedToId: assigneeId
        });

      } else {
        setFormData({
          summary: "",
          description: "",
          dueDate: "",
          typeId: 3,
          priorityId: 2,
          statusId: 1,
          assignedToId: ""
        });
      }
    }
  }, [open, initialData, users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">

        <button className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-lg" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>

        <h2 className="mb-4 text-xl font-bold text-gray-900">
          {initialData ? "Update Task" : "Create New Task"}
        </h2>

        <form onSubmit={(e) => {
          e.preventDefault();

          const taskData = {
            projectId: projectId,
            summary: formData.summary,
            description: formData.description,
            dueDate: formData.dueDate,
            assignedToId: formData.assignedToId ? Number(formData.assignedToId) : null,
            typeId: Number(formData.typeId),
            priorityId: Number(formData.priorityId),
            statusId: Number(formData.statusId),
          };

          onSubmit(taskData);
        }}
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Title</label>
            <input
              name="summary" type="text" required
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Task title..."
              value={formData.summary} onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              name="description" rows={3} required
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Details..."
              value={formData.description} onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Type</label>
              <select
                name="typeId"
                className="w-full px-3 py-2 border rounded-lg bg-white"
                value={formData.typeId} onChange={handleChange}
              >
                <option value="3">Task</option>
                <option value="2">Story</option>
                <option value="1">Epic</option>
                <option value="4">Sub-task</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Priority</label>
              <select
                name="priorityId"
                className="w-full px-3 py-2 border rounded-lg bg-white"
                value={formData.priorityId} onChange={handleChange}
              >
                <option value="2">Medium</option>
                <option value="1">Lower</option>
                <option value="3">High</option>
                <option value="4">Highest</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Status</label>
              <select
                name="statusId"
                className="w-full px-3 py-2 border rounded-lg bg-white"
                value={formData.statusId} onChange={handleChange}
              >
                <option value="1">To Do</option>
                <option value="2">In Progress</option>
                <option value="3">Blocked</option>
                <option value="5">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Due Date</label>
              <input
                name="dueDate" type="date" required
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.dueDate} onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">Assignee</label>
            <select
              name="assignedToId" required
              className="w-full px-3 py-2 border rounded-lg bg-white"
              value={formData.assignedToId} onChange={handleChange}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            {initialData ? "Update Task" : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}