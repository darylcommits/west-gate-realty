import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon, VideoCameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const BASE_URL = API_BASE_URL.replace('/api', '');

interface CarouselProperty {
  id: number;
  title: string;
  location: string;
  type: string;
  type_color: string;
  background_image: string;
  price: string;
  size: string;
  features: string[];
  description: string;
  video_url?: string | null;
  detail_images?: string[];
  order_index: number;
  is_active: boolean;
}

const CarouselManagement: React.FC = () => {
  const [properties, setProperties] = useState<CarouselProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<CarouselProperty | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: '',
    type_color: '#10b981',
    price: '',
    size: '',
    features: [''],
    description: '',
    order_index: 0,
    is_active: true,
    video_url: '',
    detail_images: [] as string[]
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [detailImageFiles, setDetailImageFiles] = useState<File[]>([]);
  const [detailImagePreviews, setDetailImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/carousel-properties`);
      const data = await response.json();
      setProperties(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
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

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetailImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setDetailImageFiles(prev => [...prev, ...fileArray]);

      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setDetailImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeDetailImage = (index: number) => {
    setDetailImageFiles(prev => prev.filter((_, i) => i !== index));
    setDetailImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingDetailImage = (imagePath: string) => {
    setFormData(prev => ({
      ...prev,
      detail_images: prev.detail_images.filter(img => img !== imagePath)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('type_color', formData.type_color);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('size', formData.size);
    formDataToSend.append('features', JSON.stringify(formData.features.filter(f => f.trim())));
    formDataToSend.append('description', formData.description);
    formDataToSend.append('order_index', formData.order_index.toString());
    formDataToSend.append('is_active', formData.is_active.toString());

    // Background image
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    } else if (editingProperty) {
      formDataToSend.append('background_image', editingProperty.background_image);
    }

    // Video
    if (videoFile) {
      formDataToSend.append('video', videoFile);
    } else if (formData.video_url) {
      formDataToSend.append('video_url', formData.video_url);
    }

    // Detail images
    detailImageFiles.forEach((file) => {
      formDataToSend.append('detailImages', file);
    });
    formDataToSend.append('detail_images', JSON.stringify(formData.detail_images));

    if (editingProperty) {
      formDataToSend.append('old_image', editingProperty.background_image);
      if (editingProperty.video_url) {
        formDataToSend.append('old_video', editingProperty.video_url);
      }
    }

    try {
      const url = editingProperty
        ? `${API_BASE_URL}/carousel-properties/${editingProperty.id}`
        : `${API_BASE_URL}/carousel-properties`;

      const method = editingProperty ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (response.ok) {
        await fetchProperties();
        closeModal();
        setMessage({
          type: 'success',
          text: editingProperty ? 'Property updated successfully!' : 'Property created successfully!'
        });
        // Auto-hide success message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
      } else {
        const error = await response.json();
        setMessage({
          type: 'error',
          text: `Error: ${error.error || 'Failed to save property'}`
        });
      }
    } catch (error) {
      console.error('Error saving property:', error);
      setMessage({
        type: 'error',
        text: 'Error saving property. Please check your connection and try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (property: CarouselProperty) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      location: property.location,
      type: property.type,
      type_color: property.type_color,
      price: property.price,
      size: property.size,
      features: property.features,
      description: property.description,
      order_index: property.order_index,
      is_active: property.is_active,
      video_url: property.video_url || '',
      detail_images: property.detail_images || []
    });
    setImagePreview(property.background_image.startsWith('http') ? property.background_image : `${BASE_URL}${property.background_image}`);

    // Set video preview if exists
    if (property.video_url) {
      setVideoPreview(property.video_url.startsWith('http') ? property.video_url : `${BASE_URL}${property.video_url}`);
    }

    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/carousel-properties/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchProperties();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Error deleting property');
    }
  };

  const openModal = () => {
    setEditingProperty(null);
    setFormData({
      title: '',
      location: '',
      type: '',
      type_color: '#10b981',
      price: '',
      size: '',
      features: [''],
      description: '',
      order_index: properties.length,
      is_active: true,
      video_url: '',
      detail_images: []
    });
    setImageFile(null);
    setImagePreview(null);
    setVideoFile(null);
    setVideoPreview(null);
    setDetailImageFiles([]);
    setDetailImagePreviews([]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProperty(null);
    setImageFile(null);
    setImagePreview(null);
    setVideoFile(null);
    setVideoPreview(null);
    setDetailImageFiles([]);
    setDetailImagePreviews([]);
  };

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Status Message */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg flex items-center justify-between ${
          message.type === 'success'
            ? 'bg-green-100 border border-green-400 text-green-700'
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="ml-4 font-bold hover:opacity-70"
          >
            &times;
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#00284b' }}>Carousel Properties</h1>
        <button
          onClick={openModal}
          className="px-4 py-2 text-white rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          style={{ backgroundColor: '#c52528' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#a01d1f'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#c52528'}
        >
          <PlusIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Add New Property</span>
          <span className="sm:hidden">Add Property</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
        />
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48">
              <img
                src={property.background_image.startsWith('http') ? property.background_image : `${BASE_URL}${property.background_image}`}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute top-2 right-2 px-2 py-1 rounded text-white text-sm font-semibold"
                style={{ backgroundColor: property.type_color }}
              >
                {property.type}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-xl font-bold mb-2" style={{ color: '#00284b' }}>{property.title}</h3>
              <p className="text-gray-600 mb-2">{property.location}</p>
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <span>{property.price}</span>
                <span>{property.size}</span>
              </div>
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">{property.description}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(property)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(property.id)}
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

      {filteredProperties.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No properties found. Add your first property to get started!
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full my-4 sm:my-8 max-h-[95vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#00284b' }}>
                {editingProperty ? 'Edit Property' : 'Add New Property'}
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Image Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Image</label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                  />
                </div>

                {/* Type and Color */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <input
                      type="text"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type Color</label>
                    <input
                      type="color"
                      name="type_color"
                      value={formData.type_color}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Price and Size */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      placeholder="₱5,000,000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      required
                      placeholder="2 Hectares"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                    />
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

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                  />
                </div>

                {/* Video Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Video (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {videoPreview ? (
                      <div className="relative">
                        <video src={videoPreview} controls className="w-full h-48 rounded" />
                        <button
                          type="button"
                          onClick={() => {
                            setVideoPreview(null);
                            setVideoFile(null);
                            setFormData(prev => ({ ...prev, video_url: '' }));
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center">
                        <VideoCameraIcon className="h-12 w-12 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload video</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Detail Images Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Detail Images (Optional)</label>

                  {/* Existing detail images */}
                  {formData.detail_images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {formData.detail_images.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={img.startsWith('http') ? img : `${BASE_URL}${img}`}
                            alt={`Detail ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingDetailImage(img)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* New detail image previews */}
                  {detailImagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {detailImagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`New ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeDetailImage(index)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <label className="cursor-pointer flex flex-col items-center">
                      <PhotoIcon className="h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to add more images</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleDetailImagesChange}
                        className="hidden"
                      />
                    </label>
                  </div>
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
                    disabled={submitting}
                    className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      submitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    style={{ backgroundColor: submitting ? '#999' : '#c52528' }}
                    onMouseOver={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#a01d1f')}
                    onMouseOut={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#c52528')}
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {editingProperty ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingProperty ? 'Update Property' : 'Create Property'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className={`flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors ${
                      submitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
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

export default CarouselManagement;
