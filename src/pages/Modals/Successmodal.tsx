import { CheckCircle2, X, AlertCircle } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: "success" | "error";
}

export default function Toast({ message, isVisible, onClose, type = "success" }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 border ${isSuccess
          ? "bg-gray-900 text-white border-gray-800"
          : "bg-red-50 text-red-700 border-red-200"
        }`}>

        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600" />
        )}

        <span className="font-medium">{message}</span>

        <button onClick={onClose} className={`ml-2 ${isSuccess ? "hover:text-gray-300" : "hover:text-red-800"}`}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}