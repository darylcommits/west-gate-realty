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
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { supabase, PropertyType } from '../../lib/supabase';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  icon: yup.string().required('Icon is required'),
  features: yup.array().of(yup.string()).default([]),
  is_active: yup.boolean().default(true),
  order_index: yup.number().min(0).default(0)
});

type PropertyTypeFormData = {
  name: string;
  description: string;
  icon: string;
  features: string[];
  is_active: boolean;
  order_index: number;
};

const PropertyTypesManagement: React.FC = () => {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPropertyType, setEditingPropertyType] = useState<PropertyType | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<PropertyTypeFormData>();

  useEffect(() => {
    fetchPropertyTypes();
  }, []);

  useEffect(() => {
    if (editingPropertyType) {
      reset({
        name: editingPropertyType.name,
        description: editingPropertyType.description,
        icon: editingPropertyType.icon,
        features: editingPropertyType.features,
        is_active: editingPropertyType.is_active,
        order_index: editingPropertyType.order_index
      });
      setFeatures(editingPropertyType.features);
    }
  }, [editingPropertyType, reset]);

  const fetchPropertyTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('property_types')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setPropertyTypes(data || []);
    } catch (error) {
      console.error('Error fetching property types:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PropertyTypeFormData) => {
    try {
      const propertyTypeData = {
        ...data,
        features: features,
        updated_at: new Date().toISOString()
      };

      if (editingPropertyType) {
        const { error } = await supabase
          .from('property_types')
          .update(propertyTypeData)
          .eq('id', editingPropertyType.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('property_types')
          .insert([propertyTypeData]);

        if (error) throw error;
      }

      await fetchPropertyTypes();
      setShowModal(false);
      setEditingPropertyType(null);
      setFeatures([]);
      reset();
    } catch (error) {
      console.error('Error saving property type:', error);
    }
  };

  const handleEdit = (propertyType: PropertyType) => {
    setEditingPropertyType(propertyType);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property type?')) return;

    try {
      const { error } = await supabase
        .from('property_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPropertyTypes();
    } catch (error) {
      console.error('Error deleting property type:', error);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('property_types')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await fetchPropertyTypes();
    } catch (error) {
      console.error('Error updating property type status:', error);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      const updatedFeatures = [...features, newFeature.trim()];
      setFeatures(updatedFeatures);
      setValue('features', updatedFeatures);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
    setValue('features', updatedFeatures);
  };

  const filteredPropertyTypes = propertyTypes.filter(propertyType =>
    propertyType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    propertyType.description.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Property Types Management</h1>
          <p className="text-gray-600">Manage property types for browsing and filtering</p>
        </div>
        <button
          onClick={() => {
            setEditingPropertyType(null);
            setShowModal(true);
            reset();
            setFeatures([]);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Property Type
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search property types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Property Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPropertyTypes.map((propertyType) => (
          <div key={propertyType.id} className={`bg-white rounded-lg shadow overflow-hidden border-l-4 ${
            propertyType.is_active ? 'border-green-500' : 'border-gray-300'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <span className="text-4xl mr-4">{propertyType.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{propertyType.name}</h3>
                    <p className="text-sm text-gray-500">Order: {propertyType.order_index}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleActive(propertyType.id, propertyType.is_active)}
                    className={`p-1 rounded-full ${
                      propertyType.is_active ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={propertyType.is_active ? 'Hide property type' : 'Show property type'}
                  >
                    {propertyType.is_active ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(propertyType)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(propertyType.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{propertyType.description}</p>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                <div className="flex flex-wrap gap-1">
                  {propertyType.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                    >
                      {feature}
                    </span>
                  ))}
                  {propertyType.features.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{propertyType.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  propertyType.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {propertyType.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(propertyType.created_at).toLocaleDateString()}
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
                {editingPropertyType ? 'Edit Property Type' : 'Add Property Type'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingPropertyType(null);
                  setFeatures([]);
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
                    Icon *
                  </label>
                  <input
                    {...register('icon')}
                    placeholder="e.g., 🏠, 🏢, 🌾, ☀️"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.icon && (
                    <p className="text-red-500 text-sm mt-1">{errors.icon.message}</p>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
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
                    {...register('is_active')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Active Property Type
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPropertyType(null);
                    setFeatures([]);
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
                  {editingPropertyType ? 'Update Property Type' : 'Add Property Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyTypesManagement;
