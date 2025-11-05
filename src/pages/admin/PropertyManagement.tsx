import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { supabase, Property } from '../../lib/supabase';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  image: yup.string().url('Must be a valid URL').required('Image URL is required'),
  price: yup.number().positive('Price must be positive').nullable(),
  location: yup.string().required('Location is required'),
  property_type: yup.string().oneOf(['Agricultural', 'Solar Projects', 'Commercial', 'Residential', 'Industrial']).required('Property type is required'),
  size: yup.string().nullable(),
  features: yup.array().of(yup.string()).default([]),
  is_featured: yup.boolean().default(false),
  is_premium: yup.boolean().default(false),
  status: yup.string().oneOf(['Available', 'Sold', 'Pending', 'Under Construction']).default('Available')
});

type PropertyFormData = {
  title: string;
  description: string;
  image: string;
  price: number | null;
  location: string;
  property_type: 'Agricultural' | 'Solar Projects' | 'Commercial' | 'Residential' | 'Industrial';
  size: string | null;
  features: string[];
  is_featured: boolean;
  is_premium: boolean;
  status: 'Available' | 'Sold' | 'Pending' | 'Under Construction';
};

const PropertyManagement: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<PropertyFormData>();

  const watchedFeatures = watch('features');

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (editingProperty) {
      reset({
        title: editingProperty.title,
        description: editingProperty.description,
        image: editingProperty.image,
        price: editingProperty.price,
        location: editingProperty.location,
        property_type: editingProperty.property_type,
        size: editingProperty.size,
        features: editingProperty.features,
        is_featured: editingProperty.is_featured,
        is_premium: editingProperty.is_premium,
        status: editingProperty.status
      });
      setFeatures(editingProperty.features);
    }
  }, [editingProperty, reset]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // Check if Supabase is configured
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
      const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
      
      if (supabaseUrl === 'https://your-project.supabase.co' || supabaseKey === 'your-anon-key') {
        // Show mock data when Supabase is not configured
        setProperties([
          {
            id: '1',
            title: 'Luxury Villa in Beverly Hills',
            description: 'Beautiful 5-bedroom villa with pool and garden',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
            price: 2500000,
            location: 'Beverly Hills, CA',
            property_type: 'Residential',
            size: '4,500 sq ft',
            features: ['Swimming Pool', 'Garden', 'Garage', 'Modern Kitchen'],
            is_featured: true,
            is_premium: true,
            status: 'Available',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Modern Apartment Downtown',
            description: 'Contemporary 2-bedroom apartment with city views',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
            price: 850000,
            location: 'Downtown LA',
            property_type: 'Residential',
            size: '1,200 sq ft',
            features: ['City Views', 'Balcony', 'Modern Appliances', 'Gym Access'],
            is_featured: false,
            is_premium: true,
            status: 'Available',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '3',
            title: 'Family Home with Garden',
            description: 'Spacious 4-bedroom family home in quiet neighborhood',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
            price: 1200000,
            location: 'Santa Monica, CA',
            property_type: 'Residential',
            size: '2,800 sq ft',
            features: ['Large Garden', 'Family Room', 'Updated Kitchen', 'Good Schools'],
            is_featured: true,
            is_premium: false,
            status: 'Sold',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date(Date.now() - 172800000).toISOString()
          }
        ]);
      } else {
        // Fetch real data from Supabase
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProperties(data || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    try {
      const propertyData = {
        ...data,
        features: features,
        updated_at: new Date().toISOString()
      };

      if (editingProperty) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingProperty.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([propertyData]);

        if (error) throw error;
      }

      await fetchProperties();
      setShowModal(false);
      setEditingProperty(null);
      setFeatures([]);
      reset();
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
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

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.property_type.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-600">Manage your property listings</p>
        </div>
        <button
          onClick={() => {
            setEditingProperty(null);
            setShowModal(true);
            reset();
            setFeatures([]);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Property
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  property.status === 'Available' ? 'bg-green-100 text-green-800' :
                  property.status === 'Sold' ? 'bg-red-100 text-red-800' :
                  property.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {property.status}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{property.location}</p>
              <p className="text-sm text-gray-500 mb-4">{property.property_type}</p>
              {property.price && (
                <p className="text-lg font-bold text-blue-600 mb-4">
                  ₱{property.price.toLocaleString()}
                </p>
              )}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(property)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(property.created_at).toLocaleDateString()}
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
                {editingProperty ? 'Edit Property' : 'Add Property'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingProperty(null);
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
                    Title *
                  </label>
                  <input
                    {...register('title')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type *
                  </label>
                  <select
                    {...register('property_type')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="Agricultural">Agricultural</option>
                    <option value="Solar Projects">Solar Projects</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                  {errors.property_type && (
                    <p className="text-red-500 text-sm mt-1">{errors.property_type.message}</p>
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
                    Price
                  </label>
                  <input
                    type="number"
                    {...register('price')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size
                  </label>
                  <input
                    {...register('size')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    {...register('is_featured')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Featured Property
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    {...register('is_premium')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Premium Property
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Pending">Pending</option>
                    <option value="Under Construction">Under Construction</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProperty(null);
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
                  {editingProperty ? 'Update Property' : 'Add Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;
