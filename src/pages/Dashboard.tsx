import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle2, Circle, Clock, Plus, ArrowLeft,
  Search, Filter, AlertCircle
} from "lucide-react";
import CreateTaskModal from "./Modals/CreateTaskModal";
import DeleteConfirmationModal from "./Modals/DeleteConfirmationModal";
import Toast from "./Modals/Successmodal";
import TaskCard from "./TaskCard";
import { taskService, type Task } from "../services/taskService";

export default function Dashboard() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectName, setProjectName] = useState("Website Redesign");
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: "success" | "error" }>({
    isVisible: false,
    message: "",
    type: "success"
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDeleteId, setTaskToDeleteId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  useEffect(() => {
    if (projectId) loadTasks();
  }, [projectId]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ isVisible: true, message, type });
  };

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await taskService.getTasksByProject(Number(projectId));
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      showToast("Could not load tasks", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedTask(null);
    setCreateModalOpen(true);
  };

  // Logic passed down to TaskCard
  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setCreateModalOpen(true);
  };

  const handleDeleteClick = (taskId: number) => {
    setTaskToDeleteId(taskId);
    setDeleteModalOpen(true);
  };

  const handleTaskSubmit = async (taskData: any) => {
    try {
      let response;
      if (selectedTask) {
        response = await taskService.updateTask(selectedTask.id, taskData);
      } else {
        response = await taskService.createTask({
          ...taskData,
          projectId: Number(projectId),
        });
      }
      showToast(response.message || "Operation successful", "success");
      loadTasks();
      setCreateModalOpen(false);
      setSelectedTask(null);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Failed to save task";
      showToast(errorMsg, "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDeleteId) return;
    setIsDeleting(true);
    try {
      const response = await taskService.deleteTask(taskToDeleteId);
      showToast(response.message || "Deleted", "success");
      loadTasks();
    } catch (error: any) {
      console.error("Delete failed", error);
      const errorMsg = error.response?.data?.message || "Failed to delete task";
      showToast(errorMsg, "error");
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setTaskToDeleteId(null);
    }
  };

  const handleStatClick = (status: string) => {
    if (filterStatus === status) setFilterStatus("All");
    else setFilterStatus(status);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const taskStatus = (task.status === "Cancelled") ? "Blocked" : task.status || "To Do";
      const matchesStatus = filterStatus === "All" || taskStatus === filterStatus;
      const taskPriority = (task as any).priority || "Medium";
      const matchesPriority = filterPriority === "All" || taskPriority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, filterStatus, filterPriority]);

  const stats = {
    todo: tasks.filter(t => t.status === "To Do").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    completed: tasks.filter(t => t.status === "Done" || t.status === "Completed").length,
    blocked: tasks.filter(t => t.status === "Blocked" || t.status === "Cancelled").length
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading tasks...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <button onClick={() => navigate("/dashboard")} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{projectName}</h1>
              <p className="text-gray-500 text-sm mt-1">{tasks.length} total tasks</p>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-all font-medium"
            >
              <Plus className="w-5 h-5" /> New Task
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div onClick={() => handleStatClick("To Do")} className={`bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:shadow-md ${filterStatus === "To Do" ? "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/10" : "border-gray-200"}`}>
            <div className="p-3 bg-gray-100 rounded-lg"><Circle className="w-6 h-6 text-gray-600" /></div>
            <div><p className="text-sm font-medium text-gray-500">To Do</p><p className="text-xl font-bold text-gray-900">{stats.todo}</p></div>
          </div>
          <div onClick={() => handleStatClick("In Progress")} className={`bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:shadow-md ${filterStatus === "In Progress" ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/10" : "border-gray-200"}`}>
            <div className="p-3 bg-blue-50 rounded-lg"><Clock className="w-6 h-6 text-blue-600" /></div>
            <div><p className="text-sm font-medium text-gray-500">In Progress</p><p className="text-xl font-bold text-gray-900">{stats.inProgress}</p></div>
          </div>
          <div onClick={() => handleStatClick("Blocked")} className={`bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:shadow-md ${filterStatus === "Blocked" ? "border-red-500 ring-1 ring-red-500 bg-red-50/10" : "border-gray-200"}`}>
            <div className="p-3 bg-red-50 rounded-lg"><AlertCircle className="w-6 h-6 text-red-600" /></div>
            <div><p className="text-sm font-medium text-gray-500">Blocked</p><p className="text-xl font-bold text-gray-900">{stats.blocked}</p></div>
          </div>
          <div onClick={() => handleStatClick("Done")} className={`bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:shadow-md ${filterStatus === "Done" ? "border-green-500 ring-1 ring-green-500 bg-green-50/10" : "border-gray-200"}`}>
            <div className="p-3 bg-green-50 rounded-lg"><CheckCircle2 className="w-6 h-6 text-green-600" /></div>
            <div><p className="text-sm font-medium text-gray-500">Done</p><p className="text-xl font-bold text-gray-900">{stats.completed}</p></div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search tasks..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-40">
                <select className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white text-sm" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                  <option value="All">All Priorities</option>
                  <option value="Highest">Highest</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Lower">Lower</option>
                </select>
                <Filter className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <div className="relative w-full md:w-40">
                <select className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
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

        {/* Task List - NOW USING THE NEW COMPONENT */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditModal}
                onDelete={handleDeleteClick}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
              <div className="text-gray-400 mb-2">No tasks found matching your filters.</div>
              <button onClick={() => { setFilterStatus("All"); setFilterPriority("All"); setSearchQuery("") }} className="text-indigo-600 text-sm font-medium hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </div>

      <CreateTaskModal
        open={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleTaskSubmit}
        projectId={Number(projectId)}
        initialData={selectedTask}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}