import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = 'http://localhost:5000/api';

interface Neighborhood {
  id: number;
  name: string;
  description: string;
  highlights: string[];
  image: string;
  location: string;
  order_index: number;
  is_popular: boolean;
}

const NeighborhoodsManagementLocal: React.FC = () => {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNeighborhood, setEditingNeighborhood] = useState<Neighborhood | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    highlights: [''],
    location: '',
    order_index: 0,
    is_popular: true
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchNeighborhoods();
  }, []);

  const fetchNeighborhoods = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/neighborhoods`);
      const data = await response.json();
      setNeighborhoods(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching neighborhoods:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData(prev => ({ ...prev, highlights: newHighlights }));
  };

  const addHighlight = () => {
    setFormData(prev => ({ ...prev, highlights: [...prev.highlights, ''] }));
  };

  const removeHighlight = (index: number) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, highlights: newHighlights }));
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
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('highlights', JSON.stringify(formData.highlights.filter(h => h.trim())));
    formDataToSend.append('location', formData.location);
    formDataToSend.append('order_index', formData.order_index.toString());
    formDataToSend.append('is_popular', formData.is_popular.toString());

    if (imageFile) {
      formDataToSend.append('image', imageFile);
    } else if (editingNeighborhood) {
      formDataToSend.append('image', editingNeighborhood.image);
    }

    if (editingNeighborhood) {
      formDataToSend.append('old_image', editingNeighborhood.image);
    }

    try {
      const url = editingNeighborhood
        ? `${API_BASE_URL}/neighborhoods/${editingNeighborhood.id}`
        : `${API_BASE_URL}/neighborhoods`;

      const method = editingNeighborhood ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (response.ok) {
        fetchNeighborhoods();
        closeModal();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving neighborhood:', error);
      alert('Error saving neighborhood');
    }
  };

  const handleEdit = (neighborhood: Neighborhood) => {
    setEditingNeighborhood(neighborhood);
    setFormData({
      name: neighborhood.name,
      description: neighborhood.description,
      highlights: neighborhood.highlights,
      location: neighborhood.location,
      order_index: neighborhood.order_index,
      is_popular: neighborhood.is_popular
    });
    setImagePreview(neighborhood.image.startsWith('http') ? neighborhood.image : `http://localhost:5000${neighborhood.image}`);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this neighborhood?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/neighborhoods/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchNeighborhoods();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting neighborhood:', error);
      alert('Error deleting neighborhood');
    }
  };

  const openModal = () => {
    setEditingNeighborhood(null);
    setFormData({
      name: '',
      description: '',
      highlights: [''],
      location: '',
      order_index: neighborhoods.length,
      is_popular: true
    });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNeighborhood(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const filteredNeighborhoods = neighborhoods.filter(neighborhood =>
    neighborhood.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    neighborhood.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    neighborhood.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#00284b' }}>Neighborhoods</h1>
        <button
          onClick={openModal}
          className="px-4 py-2 text-white rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          style={{ backgroundColor: '#c52528' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#a01d1f'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#c52528'}
        >
          <PlusIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Add Neighborhood</span>
          <span className="sm:hidden">Add New</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search neighborhoods..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
        />
      </div>

      {/* Neighborhoods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNeighborhoods.map((neighborhood) => (
          <div key={neighborhood.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48">
              <img
                src={neighborhood.image.startsWith('http') ? neighborhood.image : `http://localhost:5000${neighborhood.image}`}
                alt={neighborhood.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <h3 className="text-xl font-bold mb-2" style={{ color: '#00284b' }}>{neighborhood.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{neighborhood.location}</p>
              <p className="text-sm text-gray-700 mb-3 line-clamp-2">{neighborhood.description}</p>

              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-700 mb-1">Highlights:</p>
                <div className="flex flex-wrap gap-1">
                  {neighborhood.highlights.slice(0, 3).map((highlight, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {highlight}
                    </span>
                  ))}
                  {neighborhood.highlights.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{neighborhood.highlights.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(neighborhood)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(neighborhood.id)}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNeighborhoods.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No neighborhoods found. Add your first neighborhood to get started!
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full my-4 sm:my-8 max-h-[95vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#00284b' }}>
                {editingNeighborhood ? 'Edit Neighborhood' : 'Add New Neighborhood'}
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Image Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Neighborhood Image</label>
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

                {/* Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Neighborhood Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Location */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Sinait, Ilocos Sur"
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

                {/* Highlights */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
                  {formData.highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => handleHighlightChange(index, e.target.value)}
                        placeholder="Highlight"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      {formData.highlights.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHighlight(index)}
                          className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + Add Highlight
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
                    {editingNeighborhood ? 'Update Neighborhood' : 'Create Neighborhood'}
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

export default NeighborhoodsManagementLocal;
