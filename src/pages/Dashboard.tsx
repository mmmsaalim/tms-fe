import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2,
  Filter,
  Search,
  User,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import CreateTaskModal from "./Modals/CreateTaskModal"; // Ensure this path is correct
import { taskService, } from "../services/taskService"; // Import the service
import type { Task } from "../services/taskService";

// Status configuration (Design kept exactly the same)
const statusConfig: Record<string, any> = {
  "In Progress": {
    icon: Clock,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  Completed: {
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    badgeColor: "bg-green-100 text-green-700",
  },
  Pending: {
    icon: Circle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    badgeColor: "bg-orange-100 text-orange-700",
  },
};

export default function Dashboard() {
  // 1. State for Real Data
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "In Progress": true,
    "Completed": true,
    "Pending": true,
  });
  
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const statusGroups = ["In Progress", "Completed", "Pending"];

  // 2. Fetch Data on Load
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle Create Task (Connected to Backend)
  const handleCreateTask = async (newTaskData: any) => {
    try {
      const createdTask = await taskService.createTask(newTaskData);
      setTasks((prev) => [createdTask, ...prev]); // Add to top of list
      setCreateModalOpen(false);
    } catch (error) {
      alert("Failed to create task");
    }
  };

  // 4. Handle Delete Task (Connected to Backend)
  const handleDeleteTask = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id)); // Remove from UI
    } catch (error) {
      alert("Failed to delete task");
    }
  };

  const toggleSection = (status: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const getTasksByStatus = (status: string) => tasks.filter((task) => task.status === status);

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = selectedStatus === "all" || task.status === selectedStatus;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading tasks...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-1">Task Management Dashboard</h1>
              <p className="text-gray-600">{tasks.length} total tasks</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Task
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statusGroups.map((status) => {
            const config = statusConfig[status];
            // Safety check in case DB has status not in config
            if (!config) return null; 
            
            const StatusIcon = config.icon;
            const count = getTasksByStatus(status).length;
            
            return (
              <div
                key={status}
                className={`bg-white rounded-xl p-6 border-2 ${config.borderColor} hover:shadow-lg transition-shadow cursor-pointer`}
                onClick={() => setSelectedStatus(status)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                    <StatusIcon className={`w-6 h-6 ${config.color}`} />
                  </div>
                  <span className={`px-3 py-1 rounded-full ${config.badgeColor}`}>
                    {count}
                  </span>
                </div>
                <h3 className="text-gray-900 mb-1">{status}</h3>
                <p className="text-gray-600">
                  {count} {count === 1 ? 'task' : 'tasks'}
                </p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-900">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              {statusGroups.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tasks List - Card View (Only shows when filtered) */}
        {selectedStatus !== "all" && (
          <div className="space-y-4 mb-12">
            <h2 className="text-gray-900">Filtered Tasks</h2>
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
                <Circle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const config = statusConfig[task.status] || statusConfig["Pending"];
                const StatusIcon = config.icon;
                
                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                            <StatusIcon className={`w-5 h-5 ${config.color}`} />
                          </div>
                          <div>
                            <h3 className="text-gray-900 mb-1">{task.title}</h3>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${config.badgeColor}`}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 ml-13">
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{task.assignedTo}</span>
                          </div>
                          <div className="text-gray-500">
                            ID: {task.id}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => alert("Edit not implemented yet")}
                          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tasks by Status Sections (Accordion-like) */}
        <div className="space-y-6">
          <h2 className="text-gray-900">Tasks by Status</h2>
          
          {statusGroups.map((status) => {
            const config = statusConfig[status];
            if (!config) return null;

            const StatusIcon = config.icon;
            const statusTasks = getTasksByStatus(status);
            const isExpanded = expandedSections[status];
            
            return (
              <div key={status} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Accordion Header */}
                <button
                  onClick={() => toggleSection(status)}
                  className={`w-full p-4 ${config.bgColor} border-b ${config.borderColor} flex items-center justify-between hover:opacity-80 transition-opacity`}
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`w-6 h-6 ${config.color}`} />
                    <h3 className="text-gray-900">{status} Tasks</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full ${config.badgeColor}`}>
                      {statusTasks.length}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </button>
                
                {/* Accordion Content */}
                {isExpanded && (
                  <div className="accordion-content">
                    {statusTasks.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        No tasks in this status
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-3 text-left text-gray-700">ID</th>
                              <th className="px-6 py-3 text-left text-gray-700">Title</th>
                              <th className="px-6 py-3 text-left text-gray-700">Assigned To</th>
                              <th className="px-6 py-3 text-left text-gray-700">Status</th>
                              <th className="px-6 py-3 text-right text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {statusTasks.map((task) => (
                              <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-gray-900">{task.id}</td>
                                <td className="px-6 py-4 text-gray-900">{task.title}</td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <User className="w-4 h-4" />
                                    {task.assignedTo}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${config.badgeColor}`}>
                                    {task.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => alert("Edit not implemented yet")}
                                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Create Task Modal */}
      <CreateTaskModal
        open={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}