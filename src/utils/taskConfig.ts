import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  AlertTriangle,
  ArrowUp,    // Improved Icon
  ArrowDown,  // Improved Icon
  Minus,      // Improved Icon
  XCircle,    // For Inactive Project
  ArrowLeft   // Kept for compatibility if needed
} from "lucide-react";

// --- 1. TASK STATUS CONFIG (For TaskCard) ---
export const statusConfig: Record<string, any> = {
  "In Progress": { 
    icon: Clock, 
    color: "text-blue-600", 
    bgColor: "bg-blue-50", 
    label: "In Progress" 
  },
  "Done": { 
    icon: CheckCircle2, 
    color: "text-green-600", 
    bgColor: "bg-green-50", 
    label: "Done" 
  },
  "To Do": { 
    icon: Circle, 
    color: "text-gray-600", 
    bgColor: "bg-gray-100", 
    label: "To Do" 
  },
  "Blocked": { 
    icon: AlertCircle, 
    color: "text-red-600", 
    bgColor: "bg-red-50", 
    label: "Blocked" 
  },
  // Fallback
  "default": { 
    icon: Circle, 
    color: "text-gray-400", 
    bgColor: "bg-gray-50", 
    label: "Unknown" 
  }
};

export const priorityConfig: Record<string, any> = {
  "Highest": { 
    icon: AlertTriangle, 
    color: "text-red-700", 
    bgColor: "bg-red-100" 
  },
  "High": { 
    icon: ArrowUp, 
    color: "text-orange-700", 
    bgColor: "bg-orange-100" 
  },
  "Medium": { 
    icon: Minus, 
    color: "text-blue-700", 
    bgColor: "bg-blue-100" 
  },
  "Lower": { 
    icon: ArrowDown, 
    color: "text-gray-700", 
    bgColor: "bg-gray-100" 
  },
};

export const projectStatusConfig: Record<number, any> = {
  1: { 
    label: "Active",
    icon: CheckCircle2, 
    color: "text-green-700", 
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    gradient: "from-green-400 to-green-600"
  },
  0: { 
    label: "Inactive",
    icon: XCircle, 
    color: "text-gray-500", 
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200",
    gradient: "from-gray-300 to-gray-400"
  }
};