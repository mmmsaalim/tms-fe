import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  itemType?: string; // Add this prop
}

export default function DeleteConfirmationModal({ 
  open, 
  onClose, 
  onConfirm, 
  isDeleting,
  itemType = "Task" // Default to "Task" so Dashboard still works
}: DeleteConfirmationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          
          {/* Use itemType here */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete {itemType}?</h3>
          
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete this {itemType.toLowerCase()}? This action cannot be undone.
          </p>

          <div className="flex gap-3 w-full">
            <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button 
              onClick={onConfirm} 
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}