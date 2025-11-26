import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Filter, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import Layout from './Layout';
import TaskModal from './TaskModal';
import TaskCard from './Taskcard';
export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  createdAt: string;
}

export default function Tasks() {
  const { id: projectId } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectName, setProjectName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (!projectId) return;

    // Load project name
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      const projects = JSON.parse(savedProjects);
      const project = projects.find((p: any) => p.id === parseInt(projectId));
      if (project) {
        setProjectName(project.name);
      }
    }

    // Load tasks for this project
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '{}');
    const projectTasks = allTasks[projectId] || [];
    
    if (projectTasks.length === 0 && !allTasks[projectId]) {
      // Seed with demo tasks for first visit
      const demoTasks: Task[] = [
        {
          id: 1,
          title: 'Design homepage mockup',
          description: 'Create initial wireframes and mockups for the new homepage design',
          priority: 'high',
          status: 'in-progress',
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: 'Setup development environment',
          description: 'Configure local development environment with all necessary tools',
          priority: 'high',
          status: 'completed',
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          title: 'Review competitor websites',
          description: 'Research and analyze competitor websites for inspiration',
          priority: 'medium',
          status: 'todo',
          createdAt: new Date().toISOString(),
        },
        {
          id: 4,
          title: 'Update documentation',
          description: 'Update project documentation with latest changes',
          priority: 'low',
          status: 'todo',
          createdAt: new Date().toISOString(),
        },
      ];
      setTasks(demoTasks);
      allTasks[projectId] = demoTasks;
      localStorage.setItem('tasks', JSON.stringify(allTasks));
    } else {
      setTasks(projectTasks);
    }
  }, [projectId]);

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    
    // Save to localStorage
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '{}');
    allTasks[projectId!] = updatedTasks;
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    
    // Update project task count
    updateProjectTaskCount(updatedTasks.length);
    
    setIsModalOpen(false);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!editingTask) return;

    const updatedTasks = tasks.map((t) =>
      t.id === editingTask.id ? { ...t, ...taskData } : t
    );
    
    setTasks(updatedTasks);
    
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '{}');
    allTasks[projectId!] = updatedTasks;
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    
    setEditingTask(null);
  };

  const handleDeleteTask = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = tasks.filter((t) => t.id !== id);
      setTasks(updatedTasks);
      
      const allTasks = JSON.parse(localStorage.getItem('tasks') || '{}');
      allTasks[projectId!] = updatedTasks;
      localStorage.setItem('tasks', JSON.stringify(allTasks));
      
      updateProjectTaskCount(updatedTasks.length);
    }
  };

  const updateProjectTaskCount = (count: number) => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      const projects = JSON.parse(savedProjects);
      const updatedProjects = projects.map((p: any) =>
        p.id === parseInt(projectId!) ? { ...p, taskCount: count } : p
      );
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesPriority && matchesStatus;
  });

  const statusStats = {
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-2">{projectName}</h1>
              <p className="text-gray-600">{tasks.length} total tasks</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Circle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-gray-600">To Do</p>
                <p className="text-gray-900">{statusStats.todo}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600">In Progress</p>
                <p className="text-gray-900">{statusStats.inProgress}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600">Completed</p>
                <p className="text-gray-900">{statusStats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-900">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <CheckCircle2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">
              {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
            </h3>
            <p className="text-gray-600 mb-6">
              {tasks.length === 0 ? 'Create your first task to get started' : 'Try adjusting your filters'}
            </p>
            {tasks.length === 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {(isModalOpen || editingTask) && (
          <TaskModal
            task={editingTask}
            onClose={() => {
              setIsModalOpen(false);
              setEditingTask(null);
            }}
            onSave={editingTask ? handleUpdateTask : handleCreateTask}
          />
        )}
      </div>
    </Layout>
  );
}
