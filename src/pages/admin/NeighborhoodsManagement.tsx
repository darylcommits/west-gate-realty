import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { supabase, Neighborhood } from '../../lib/supabase';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  image: yup.string().url('Must be a valid URL').required('Image URL is required'),
  location: yup.string().required('Location is required'),
  average_price: yup.number().positive('Price must be positive').nullable(),
  amenities: yup.array().of(yup.string()).default([]),
  is_popular: yup.boolean().default(false),
  order_index: yup.number().min(0).default(0)
});

type NeighborhoodFormData = {
  name: string;
  description: string;
  image: string;
  location: string;
  average_price: number | null;
  amenities: string[];
  is_popular: boolean;
  order_index: number;
};

const NeighborhoodsManagement: React.FC = () => {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingNeighborhood, setEditingNeighborhood] = useState<Neighborhood | null>(null);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<NeighborhoodFormData>();

  useEffect(() => {
    fetchNeighborhoods();
  }, []);

  useEffect(() => {
    if (editingNeighborhood) {
      reset({
        name: editingNeighborhood.name,
        description: editingNeighborhood.description,
        image: editingNeighborhood.image,
        location: editingNeighborhood.location,
        average_price: editingNeighborhood.average_price,
        amenities: editingNeighborhood.amenities,
        is_popular: editingNeighborhood.is_popular,
        order_index: editingNeighborhood.order_index
      });
      setAmenities(editingNeighborhood.amenities);
    }
  }, [editingNeighborhood, reset]);

  const fetchNeighborhoods = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('neighborhoods')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setNeighborhoods(data || []);
    } catch (error) {
      console.error('Error fetching neighborhoods:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: NeighborhoodFormData) => {
    try {
      const neighborhoodData = {
        ...data,
        amenities: amenities,
        updated_at: new Date().toISOString()
      };

      if (editingNeighborhood) {
        const { error } = await supabase
          .from('neighborhoods')
          .update(neighborhoodData)
          .eq('id', editingNeighborhood.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('neighborhoods')
          .insert([neighborhoodData]);

        if (error) throw error;
      }

      await fetchNeighborhoods();
      setShowModal(false);
      setEditingNeighborhood(null);
      setAmenities([]);
      reset();
    } catch (error) {
      console.error('Error saving neighborhood:', error);
    }
  };

  const handleEdit = (neighborhood: Neighborhood) => {
    setEditingNeighborhood(neighborhood);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this neighborhood?')) return;

    try {
      const { error } = await supabase
        .from('neighborhoods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchNeighborhoods();
    } catch (error) {
      console.error('Error deleting neighborhood:', error);
    }
  };

  const togglePopular = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('neighborhoods')
        .update({ is_popular: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await fetchNeighborhoods();
    } catch (error) {
      console.error('Error updating neighborhood popularity:', error);
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      const updatedAmenities = [...amenities, newAmenity.trim()];
      setAmenities(updatedAmenities);
      setValue('amenities', updatedAmenities);
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    const updatedAmenities = amenities.filter((_, i) => i !== index);
    setAmenities(updatedAmenities);
    setValue('amenities', updatedAmenities);
  };

  const filteredNeighborhoods = neighborhoods.filter(neighborhood =>
    neighborhood.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    neighborhood.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    neighborhood.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Neighborhoods Management</h1>
          <p className="text-gray-600">Manage popular neighborhoods and areas</p>
        </div>
        <button
          onClick={() => {
            setEditingNeighborhood(null);
            setShowModal(true);
            reset();
            setAmenities([]);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Neighborhood
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search neighborhoods..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Neighborhoods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNeighborhoods.map((neighborhood) => (
          <div key={neighborhood.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative">
              <img
                src={neighborhood.image}
                alt={neighborhood.name}
                className="w-full h-48 object-cover"
              />
              {neighborhood.is_popular && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <StarIcon className="h-3 w-3 mr-1" />
                  Popular
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{neighborhood.name}</h3>
                  <p className="text-sm text-gray-600">{neighborhood.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => togglePopular(neighborhood.id, neighborhood.is_popular)}
                    className={`p-1 rounded-full ${
                      neighborhood.is_popular ? 'text-yellow-600 hover:text-yellow-700' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={neighborhood.is_popular ? 'Remove from popular' : 'Mark as popular'}
                  >
                    <StarIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(neighborhood)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(neighborhood.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{neighborhood.description}</p>

              {neighborhood.average_price && (
                <div className="mb-4">
                  <p className="text-lg font-bold text-blue-600">
                    ₱{neighborhood.average_price.toLocaleString()}
                    <span className="text-sm text-gray-500 font-normal"> average</span>
                  </p>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Amenities:</h4>
                <div className="flex flex-wrap gap-1">
                  {neighborhood.amenities.slice(0, 3).map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                    >
                      {amenity}
                    </span>
                  ))}
                  {neighborhood.amenities.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{neighborhood.amenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Order: {neighborhood.order_index}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  neighborhood.is_popular ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {neighborhood.is_popular ? 'Popular' : 'Standard'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingNeighborhood ? 'Edit Neighborhood' : 'Add Neighborhood'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingNeighborhood(null);
                  setAmenities([]);
                  reset();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    {...register('name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    {...register('location')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL *
                  </label>
                  <input
                    {...register('image')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.image && (
                    <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Average Price
                  </label>
                  <input
                    type="number"
                    {...register('average_price')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.average_price && (
                    <p className="text-red-500 text-sm mt-1">{errors.average_price.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenities
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Add an amenity..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addAmenity}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(index)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Index
                  </label>
                  <input
                    type="number"
                    {...register('order_index')}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    {...register('is_popular')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Popular Neighborhood
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingNeighborhood(null);
                    setAmenities([]);
                    reset();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingNeighborhood ? 'Update Neighborhood' : 'Add Neighborhood'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeighborhoodsManagement;
