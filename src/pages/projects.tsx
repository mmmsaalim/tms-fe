import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { 
  Plus, 
  FolderOpen, 
  LogOut, 
  Search, 
  Edit2, 
  Trash2, 
  Calendar, 
  Clock ,
  ListChecks
} from 'lucide-react'; 
import { projectService, type Project } from '../services/projectService';
import CreateProjectModal from './Modals/CreateProjectModal';
import DeleteConfirmationModal from './Modals/DeleteConfirmationModal';
import Toast from './Modals/Successmodal';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToDeleteId, setProjectToDeleteId] = useState<number | null>(null);

  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: "success" | "error" }>({ 
    isVisible: false, 
    message: "", 
    type: "success" 
  });

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ isVisible: true, message, type });
  };

  const fetchProjects = async () => {
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects", error);
      showToast("Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setProjectToEdit(null); 
    setCreateModalOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation(); 
    setProjectToEdit(project); 
    setCreateModalOpen(true);
  };

  const openDeleteModal = (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation(); 
    setProjectToDeleteId(projectId);
    setDeleteModalOpen(true);
  };

  const handleProjectSubmit = async (data: { title: string; description: string }) => {
    if (!user || !user.id) {
      showToast("User not logged in or ID missing", "error");
      return;
    }

    try {
      if (projectToEdit) {
        await projectService.updateProject(projectToEdit.id, data);
        showToast("Project updated successfully", "success");
      } else {
        await projectService.createProject({ 
          ...data,
          status: 1, 
          projectOwnerId: Number(user.id), 
          createdById: Number(user.id)     
        });
        showToast("Project created successfully", "success");
      }
      
      await fetchProjects(); 
      setCreateModalOpen(false);
      setProjectToEdit(null);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Operation failed";
      showToast(msg, "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!projectToDeleteId) return;
    
    setIsDeleting(true);
    try {
      const response = await projectService.deleteProject(projectToDeleteId);
      showToast(response.message || "Project deleted", "success");
      await fetchProjects();
    } catch (error: any) {
      console.error("Delete failed", error);
      const msg = error.response?.data?.message || "Failed to delete project";
      showToast(msg, "error");
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setProjectToDeleteId(null);
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
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
          
          <button
            onClick={openCreateModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm font-medium"
          >
            <Plus className="w-5 h-5" /> New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300 text-center">
            <div className="p-4 bg-indigo-50 rounded-full mb-4">
              <FolderOpen className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
            <p className="text-gray-500 mt-1 mb-6 max-w-sm">Get started by creating your first project.</p>
            <button onClick={openCreateModal} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
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
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-indigo-50 group-hover:bg-indigo-100 rounded-lg transition-colors">
                    <FolderOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                
                  <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => openEditModal(e, project)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => openDeleteModal(e, project.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                  {project.description || "No description provided."}
                </p>

                <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
                  <ListChecks className="w-4 h-4 text-indigo-600" />
                  <span>{project._count?.tasks ?? 0} tasks</span>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-2 space-y-2">
                   <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>Created</span>
                      </div>
                      <span>{new Date(project.createdOn).toLocaleDateString()}</span>
                   </div>

                   {project.updatedOn && (
                     <div className="flex items-center justify-between text-xs text-blue-600/80">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Updated</span>
                        </div>
                        <span className="font-medium">{new Date(project.updatedOn).toLocaleDateString()}</span>
                     </div>
                   )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal 
        open={isCreateModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        onSubmit={handleProjectSubmit}
        initialData={projectToEdit} 
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        itemType="Project" 
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