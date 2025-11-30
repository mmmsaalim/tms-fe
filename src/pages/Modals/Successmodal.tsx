import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-400" />
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:text-gray-300">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}