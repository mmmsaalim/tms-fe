import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle2, Circle, Clock, Plus, Edit2, Trash2, ArrowLeft,
  Search, Filter, Calendar, AlertCircle, AlertTriangle
} from "lucide-react";
import CreateTaskModal from "./Modals/CreateTaskModal";
import Toast from "./Modals/Successmodal";
import { taskService, type Task } from "../services/taskService";

const statusConfig: Record<string, any> = {
  "In Progress": { icon: Clock, color: "text-blue-600", bgColor: "bg-blue-50", label: "In Progress" },
  "Done": { icon: CheckCircle2, color: "text-green-600", bgColor: "bg-green-50", label: "Done" },
  "To Do": { icon: Circle, color: "text-gray-600", bgColor: "bg-gray-100", label: "To Do" },
  "Blocked": { icon: AlertCircle, color: "text-red-600", bgColor: "bg-red-50", label: "Blocked" },
};

const priorityConfig: Record<string, any> = {
  "Highest": { color: "text-red-700", bgColor: "bg-red-100", icon: AlertTriangle },
  "High": { color: "text-orange-700", bgColor: "bg-orange-100", icon: ArrowLeft }, 
  "Medium": { color: "text-blue-700", bgColor: "bg-blue-100", icon: Circle },
  "Lower": { color: "text-gray-700", bgColor: "bg-gray-100", icon: Circle },
};

export default function Dashboard() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Data State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectName, setProjectName] = useState("Website Redesign");
  const [isLoading, setIsLoading] = useState(true);

  // UI State
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: "" });

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  useEffect(() => {
    if (projectId) loadTasks();
  }, [projectId]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await taskService.getTasksByProject(Number(projectId));
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (newTaskData: any) => {
    try {
      await taskService.createTask({
        ...newTaskData,
        projectId: Number(projectId),
        createdById: 1, 
        typeId: 3,
        priorityId: 2,
        statusId: 1
      });
      loadTasks();
      setCreateModalOpen(false);
      setToast({ isVisible: true, message: "Task created successfully!" });
    } catch (error) {
      alert("Failed to create task");
    }
  };

  // --- NEW: Handle Click on Stats Card ---
  const handleStatClick = (status: string) => {
    // If clicking the already selected status, toggle back to "All"
    if (filterStatus === status) {
      setFilterStatus("All");
    } else {
      setFilterStatus(status);
    }
  };

  // --- Filtering Logic ---
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Search Filter
      const matchesSearch = task.summary.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Status Filter (Includes normalization for Cancelled -> Blocked)
      const taskStatus = (task.status === "Cancelled") ? "Blocked" : task.status || "To Do";
      const matchesStatus = filterStatus === "All" || taskStatus === filterStatus;

      // 3. Priority Filter
      const taskPriority = (task as any).priority || "Medium";
      const matchesPriority = filterPriority === "All" || taskPriority === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, filterStatus, filterPriority]);

  // --- Stats Calculation ---
  const stats = {
    todo: tasks.filter(t => t.status === "To Do").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    completed: tasks.filter(t => t.status === "Done" || t.status === "Completed").length,
    blocked: tasks.filter(
      t => t.status === "Blocked" || t.status === "Cancelled" || t.status === "cancelled"
    ).length
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading tasks...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">

          {/* Top Nav */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{projectName}</h1>
              <p className="text-gray-500 text-sm mt-1">{tasks.length} total tasks</p>
            </div>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-all font-medium"
            >
              <Plus className="w-5 h-5" /> New Task
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* Stats Cards (Now Clickable) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* To Do Card */}
          <div 
            onClick={() => handleStatClick("To Do")}
            className={`bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:shadow-md 
              ${filterStatus === "To Do" ? "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/10" : "border-gray-200"}`}
          >
            <div className="p-3 bg-gray-100 rounded-lg">
              <Circle className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">To Do</p>
              <p className="text-xl font-bold text-gray-900">{stats.todo}</p>
            </div>
          </div>

          {/* In Progress Card */}
          <div 
            onClick={() => handleStatClick("In Progress")}
            className={`bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:shadow-md 
              ${filterStatus === "In Progress" ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/10" : "border-gray-200"}`}
          >
            <div className="p-3 bg-blue-50 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>

          {/* Blocked Card */}
          <div 
            onClick={() => handleStatClick("Blocked")}
            className={`bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:shadow-md 
              ${filterStatus === "Blocked" ? "border-red-500 ring-1 ring-red-500 bg-red-50/10" : "border-gray-200"}`}
          >
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Blocked</p>
              <p className="text-xl font-bold text-gray-900">{stats.blocked}</p>
            </div>
          </div>

          {/* Completed Card */}
          <div 
            onClick={() => handleStatClick("Done")}
            className={`bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:shadow-md 
              ${filterStatus === "Done" ? "border-green-500 ring-1 ring-green-500 bg-green-50/10" : "border-gray-200"}`}
          >
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Done</p>
              <p className="text-xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Dropdowns */}
            <div className="flex gap-3 w-full md:w-auto">
              {/* Priority Filter */}
              <div className="relative w-full md:w-40">
                <select
                  className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white text-sm"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="All">All Priorities</option>
                  <option value="Highest">Highest</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Lower">Lower</option>
                </select>
                <Filter className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              {/* Status Filter (Synced with cards) */}
              <div className="relative w-full md:w-40">
                <select
                  className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Done">Done</option>
                </select>
                <Filter className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => {
              const statusName = task.status || "To Do";
              const sConf = statusConfig[statusName] || statusConfig["To Do"];
              const StatusIcon = sConf.icon;

              const priorityName = (task as any).priority || "Medium";
              const pConf = priorityConfig[priorityName] || priorityConfig["Medium"];

              const dueDate = "11/30/2025";

              return (
                <div key={task.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{task.summary}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${pConf.bgColor} ${pConf.color}`}>
                        {priorityName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded-md transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {(task as any).description || "No description provided."}
                  </p>

                  <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${sConf.bgColor} ${sConf.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusName}
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      {dueDate}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
              <div className="text-gray-400 mb-2">No tasks found matching your filters.</div>
              <button onClick={() => { setFilterStatus("All"); setFilterPriority("All"); setSearchQuery("") }} className="text-indigo-600 text-sm font-medium hover:underline">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      <CreateTaskModal open={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onSubmit={handleCreateTask} />
      <Toast message={toast.message} isVisible={toast.isVisible} onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} />
    </div>
  );
}