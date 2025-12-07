import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

export const statusConfig: Record<string, any> = {
  "In Progress": { icon: Clock, color: "text-blue-600", bgColor: "bg-blue-50", label: "In Progress" },
  "Done": { icon: CheckCircle2, color: "text-green-600", bgColor: "bg-green-50", label: "Done" },
  "To Do": { icon: Circle, color: "text-gray-600", bgColor: "bg-gray-100", label: "To Do" },
  "Blocked": { icon: AlertCircle, color: "text-red-600", bgColor: "bg-red-50", label: "Blocked" },
};

export const priorityConfig: Record<string, any> = {
  "Highest": { color: "text-red-700", bgColor: "bg-red-100", icon: AlertTriangle },
  "High": { color: "text-orange-700", bgColor: "bg-orange-100", icon: ArrowLeft },
  "Medium": { color: "text-blue-700", bgColor: "bg-blue-100", icon: Circle },
  "Lower": { color: "text-gray-700", bgColor: "bg-gray-100", icon: Circle },
};