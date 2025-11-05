import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = 'http://localhost:5000/api';

interface FeaturedProject {
  id: number;
  title: string;
  description: string;
  image: string;
  bg_gradient: string;
  features: string[];
  stats: { [key: string]: string };
  type: string;
  order_index: number;
  is_featured: boolean;
}

const FeaturedProjectsManagementLocal: React.FC = () => {
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<FeaturedProject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    bg_gradient: string;
    features: string[];
    stats: { [key: string]: string };
    type: string;
    order_index: number;
    is_featured: boolean;
  }>({
    title: '',
    description: '',
    bg_gradient: 'from-blue-400 to-indigo-600',
    features: [''],
    stats: {},
    type: '',
    order_index: 0,
    is_featured: true
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/featured-projects`);
      const data = await response.json();
      setProjects(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleStatChange = (key: string, value: string, oldKey?: string) => {
    const newStats = { ...formData.stats };

    if (oldKey && oldKey !== key) {
      delete newStats[oldKey];
    }

    if (key) {
      newStats[key] = value;
    }

    setFormData(prev => ({ ...prev, stats: newStats }));
  };

  const addStat = () => {
    setFormData(prev => ({ ...prev, stats: { ...prev.stats, '': '' } }));
  };

  const removeStat = (key: string) => {
    const newStats = { ...formData.stats };
    delete newStats[key];
    setFormData(prev => ({ ...prev, stats: newStats }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('bg_gradient', formData.bg_gradient);
    formDataToSend.append('features', JSON.stringify(formData.features.filter(f => f.trim())));
    formDataToSend.append('stats', JSON.stringify(formData.stats));
    formDataToSend.append('type', formData.type);
    formDataToSend.append('order_index', formData.order_index.toString());
    formDataToSend.append('is_featured', formData.is_featured.toString());

    if (imageFile) {
      formDataToSend.append('image', imageFile);
    } else if (editingProject) {
      formDataToSend.append('image', editingProject.image);
    }

    if (editingProject) {
      formDataToSend.append('old_image', editingProject.image);
    }

    try {
      const url = editingProject
        ? `${API_BASE_URL}/featured-projects/${editingProject.id}`
        : `${API_BASE_URL}/featured-projects`;

      const method = editingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (response.ok) {
        fetchProjects();
        closeModal();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project');
    }
  };

  const handleEdit = (project: FeaturedProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      bg_gradient: project.bg_gradient,
      features: project.features,
      stats: project.stats,
      type: project.type,
      order_index: project.order_index,
      is_featured: project.is_featured
    });
    setImagePreview(project.image.startsWith('http') ? project.image : `http://localhost:5000${project.image}`);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/featured-projects/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchProjects();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  const openModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      bg_gradient: 'from-blue-400 to-indigo-600',
      features: [''],
      stats: {},
      type: '',
      order_index: projects.length,
      is_featured: true
    });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const gradients = [
    'from-blue-400 to-indigo-600',
    'from-green-400 to-emerald-600',
    'from-amber-400 to-orange-600',
    'from-purple-400 to-indigo-600',
    'from-pink-400 to-rose-600',
    'from-cyan-400 to-blue-600'
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#00284b' }}>Featured Projects</h1>
        <button
          onClick={openModal}
          className="px-4 py-2 text-white rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          style={{ backgroundColor: '#c52528' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#a01d1f'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#c52528'}
        >
          <PlusIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Add New Project</span>
          <span className="sm:hidden">Add Project</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className={`bg-gradient-to-br ${project.bg_gradient} rounded-lg shadow-lg overflow-hidden text-white`}>
            <div className="relative h-48">
              <img
                src={project.image.startsWith('http') ? project.image : `http://localhost:5000${project.image}`}
                alt={project.title}
                className="w-full h-full object-cover opacity-80"
              />
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <span className="px-2 py-1 bg-white bg-opacity-30 rounded text-xs">
                  {project.type}
                </span>
              </div>
              <p className="text-sm mb-3 opacity-90">{project.description}</p>

              <div className="mb-3">
                <p className="text-xs font-semibold mb-1">Features:</p>
                <div className="flex flex-wrap gap-1">
                  {project.features.slice(0, 3).map((feature, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(project)}
                  className="flex-1 px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="flex-1 px-3 py-2 bg-red-600 bg-opacity-80 hover:bg-opacity-100 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No projects found. Add your first project to get started!
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full my-4 sm:my-8 max-h-[95vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#00284b' }}>
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Image Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setImageFile(null);
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center">
                        <PhotoIcon className="h-12 w-12 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Type and Gradient */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <input
                      type="text"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., agricultural, commercial"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Background Gradient</label>
                    <select
                      name="bg_gradient"
                      value={formData.bg_gradient}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {gradients.map(gradient => (
                        <option key={gradient} value={gradient}>{gradient}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder="Feature"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + Add Feature
                  </button>
                </div>

                {/* Stats */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stats (Key-Value Pairs)</label>
                  {Object.entries(formData.stats).map(([key, value], index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => handleStatChange(e.target.value, value, key)}
                        placeholder="Stat Name (e.g., Size)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleStatChange(key, e.target.value)}
                        placeholder="Stat Value (e.g., 2.5 hectares)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      {Object.keys(formData.stats).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStat(key)}
                          className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addStat}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + Add Stat
                  </button>
                </div>

                {/* Order Index */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                  <input
                    type="number"
                    name="order_index"
                    value={formData.order_index}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-white rounded-lg transition-colors"
                    style={{ backgroundColor: '#c52528' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#a01d1f'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#c52528'}
                  >
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedProjectsManagementLocal;
