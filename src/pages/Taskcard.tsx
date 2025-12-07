import { Edit2, Trash2, Calendar, User, Tag } from "lucide-react";
import { type Task } from "../services/taskService";
import { statusConfig, priorityConfig } from "../utils/taskConfig"; 

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const statusName = task.status || "To Do";
  const sConf = statusConfig[statusName] || statusConfig["To Do"];
  const StatusIcon = sConf.icon;
  
  const priorityName = (task as any).priority || "Medium";
  const pConf = priorityConfig[priorityName] || priorityConfig["Medium"];
  
  const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Date";

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">{task.summary}</h3>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${pConf.bgColor} ${pConf.color}`}>
            {priorityName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
        {(task as any).description || "No description provided."}
      </p>

      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${sConf.bgColor} ${sConf.color}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {statusName}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
          <Tag className="w-3.5 h-3.5 text-gray-500" />
          {(task as any).type || "Task"}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <User className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-medium text-gray-700">
            {(task as any).assignedTo || "Unassigned"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs ml-auto">
          <Calendar className="w-3.5 h-3.5" />
          {dueDate}
        </div>
      </div>
    </div>
  );
}