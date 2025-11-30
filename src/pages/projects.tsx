import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Plus, FolderOpen, LogOut, Search } from 'lucide-react';
import { projectService, type Project } from '../services/projectService';
import CreateProjectModal from './Modals/CreateProjectModal';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects", error);
    } finally {
      setLoading(false);
    }
  };

const handleCreateProject = async (data: { title: string; description: string }) => {
    // 1. Security Check: Ensure user is logged in and has an ID
    if (!user || !user.id) {
      alert("You are not logged in or your User ID is missing.");
      return;
    }

    try {
      await projectService.createProject({ 
        title: data.title, 
        description: data.description,
        status: 1, 
        
        // 2. CHANGE THIS: Use the logged-in user's ID
        projectOwnerId: Number(user.id), 
        createdById: Number(user.id)     
      });
      
      await fetchProjects(); 
      setCreateModalOpen(false); // Close modal on success
    } catch (error) {
      alert("Error creating project");
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading Projects...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Projects</h1>
              <p className="text-sm text-gray-500">Manage your work and tasks</p>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
               <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                 <LogOut className="w-4 h-4" /> Logout
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
          
          <button
            onClick={() => setCreateModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm font-medium"
          >
            <Plus className="w-5 h-5" /> New Project
          </button>
        </div>

        {/* Project Grid */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300 text-center">
            <div className="p-4 bg-indigo-50 rounded-full mb-4">
              <FolderOpen className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
            <p className="text-gray-500 mt-1 mb-6 max-w-sm">Get started by creating your first project to organize tasks and collaborate.</p>
            <button
               onClick={() => setCreateModalOpen(true)}
               className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer relative overflow-hidden"
                onClick={() => navigate(`/projects/${project.id}/tasks`)}
              >
                {/* Decorative top bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-indigo-50 group-hover:bg-indigo-100 rounded-lg transition-colors">
                    <FolderOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  {/* You can add a 3-dot menu here later if needed */}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                  {project.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-4 mt-2">
                   <span>Created {new Date(project.createdOn).toLocaleDateString()}</span>
                   <span className="flex items-center gap-1 text-indigo-600 font-medium">
                     View Tasks &rarr;
                   </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* The Modal */}
      <CreateProjectModal 
        open={isCreateModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        onSubmit={handleCreateProject} 
      />
    </div>
  );
}