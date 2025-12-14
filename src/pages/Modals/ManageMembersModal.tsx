// src/components/Modals/ManageMembersModal.tsx
import { useState, useEffect } from "react";
import { X, UserPlus, } from "lucide-react";
import { userService } from "../../services/userService";
import { projectService } from "../../services/projectService";

interface ManageMembersModalProps {
  open: boolean;
  onClose: () => void;
  projectId: number;
}

export default function ManageMembersModal({ open, onClose, projectId }: ManageMembersModalProps) {
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState(2); 
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (open) loadMembers();
  }, [open, projectId]);

  const loadMembers = async () => {
    try {
      const data = await userService.getProjectUsers(projectId);
      setMembers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await projectService.addMember(projectId, email, Number(roleId));
      setMsg({ text: "User added successfully!", type: "success" });
      setEmail("");
      loadMembers();
    } catch (error: any) {
      setMsg({ text: error.response?.data?.message || "Failed to add user", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-600"/> Manage Members
          </h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="p-6">
          <form onSubmit={handleAddUser} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Email</label>
              <input 
                type="email" required 
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select 
                  value={roleId} onChange={e => setRoleId(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value={1}>Admin (Full Access)</option>
                  <option value={2}>User (Can Edit Tasks)</option>
                  <option value={3}>Viewer (Read Only)</option>
                </select>
              </div>
              <div className="flex items-end">
                 <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                    {loading ? "Adding..." : "Add"}
                 </button>
              </div>
            </div>
            {msg && (
              <p className={`text-sm ${msg.type === 'success' ? "text-green-600" : "text-red-600"}`}>
                {msg.text}
              </p>
            )}
          </form>

          <h4 className="font-medium text-gray-700 mb-2">Current Members</h4>
          <div className="bg-gray-50 rounded-lg border max-h-48 overflow-y-auto">
             {members.map((m, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 border-b last:border-0">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.email}</p>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}