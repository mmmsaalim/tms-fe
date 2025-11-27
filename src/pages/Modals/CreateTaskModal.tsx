import { X } from "lucide-react";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
}

export default function CreateTaskModal({ open, onClose, onSubmit }: CreateTaskModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">

        {/* Close button */}
        <button
          className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-lg"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="mb-4 text-gray-900">Create New Task</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();

            const form = new FormData(e.currentTarget);
            const newTask = {
              title: form.get("title"),
              assignedTo: form.get("assignedTo"),
              status: form.get("status"),
            };

            onSubmit(newTask);
          }}
        >
          <div className="mb-4">
            <label className="text-gray-700">Task Title</label>
            <input
              name="title"
              type="text"
              required
              className="w-full mt-1 px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-700">Assigned To</label>
            <input
              name="assignedTo"
              type="text"
              required
              className="w-full mt-1 px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-700">Status</label>
            <select
              name="status"
              className="w-full mt-1 px-3 py-2 border rounded-lg"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}
