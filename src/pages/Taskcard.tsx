import { Edit2, Trash2, Flag, Circle, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Task } from './Tasks';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const priorityColors = {
    low: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    high: 'bg-red-100 text-red-700 border-red-200',
  };

  const statusConfig = {
    'todo': {
      label: 'To Do',
      icon: Circle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
    'in-progress': {
      label: 'In Progress',
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    'completed': {
      label: 'Completed',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  };

  const StatusIcon = statusConfig[task.status].icon;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-gray-900">{task.title}</h3>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${priorityColors[task.priority]}`}>
              <Flag className="w-3 h-3" />
              <span className="capitalize">{task.priority}</span>
            </div>
          </div>
          <p className="text-gray-600 mb-3">{task.description}</p>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${statusConfig[task.status].bgColor}`}>
              <StatusIcon className={`w-4 h-4 ${statusConfig[task.status].color}`} />
              <span className={statusConfig[task.status].color}>
                {statusConfig[task.status].label}
              </span>
            </div>
            <span className="text-gray-500">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
