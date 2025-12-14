import { useState, useEffect } from "react";
import { X, FolderPlus, Edit2, UserCircle } from "lucide-react";
import { userService, type User } from "../../services/userService";

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (projectData: { title: string; description: string; status: number; projectOwnerId?: number }) => Promise<void>;
  initialData?: {
    title: string;
    description?: string | null;
    status?: number;
    projectOwnerId?: number
  } | null;
}

export default function CreateProjectModal({ open, onClose, onSubmit, initialData }: CreateProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [ownerId, setOwnerId] = useState<number | string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      const loadUsers = async () => {
        try {
          const data = await userService.getAllUsers();
          setUsers(data);
        } catch (err) {
          console.error("Failed to load users", err);
        }
      };
      loadUsers();
    }
  }, [open]);

  useEffect(() => {
    if (open && initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setStatus(initialData.status !== undefined ? initialData.status : 1);
      setOwnerId(initialData.projectOwnerId || "");
    } else if (open && !initialData) {
      setTitle("");
      setDescription("");
      setStatus(1);
      setOwnerId("");
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const payload: any = {
        title,
        description,
        status: Number(status),
      };

      if (ownerId && ownerId !== "") {
        payload.projectOwnerId = Number(ownerId);
      }

      await onSubmit(payload);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              {isEditMode ? <Edit2 className="w-5 h-5 text-indigo-600" /> : <FolderPlus className="w-5 h-5 text-indigo-600" />}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{isEditMode ? "Edit Project" : "Create New Project"}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>

            {isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={ownerId}
                    onChange={(e) => setOwnerId(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {isSubmitting ? "Saving..." : (isEditMode ? "Update Project" : "Create Project")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}