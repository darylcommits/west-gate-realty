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
import { supabase, Portfolio } from '../../lib/supabase';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  image: yup.string().url('Must be a valid URL').required('Image URL is required'),
  category: yup.string().required('Category is required'),
  location: yup.string().required('Location is required'),
  completion_date: yup.date().nullable(),
  is_premium: yup.boolean().default(false),
  order_index: yup.number().min(0).default(0)
});

type PortfolioFormData = {
  title: string;
  description: string;
  image: string;
  category: string;
  location: string;
  completion_date: Date | null;
  is_premium: boolean;
  order_index: number;
};

const PortfolioManagement: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PortfolioFormData>();

  useEffect(() => {
    fetchPortfolios();
  }, []);

  useEffect(() => {
    if (editingPortfolio) {
      reset({
        title: editingPortfolio.title,
        description: editingPortfolio.description,
        image: editingPortfolio.image,
        category: editingPortfolio.category,
        location: editingPortfolio.location,
        completion_date: editingPortfolio.completion_date ? new Date(editingPortfolio.completion_date) : null,
        is_premium: editingPortfolio.is_premium,
        order_index: editingPortfolio.order_index
      });
    }
  }, [editingPortfolio, reset]);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setPortfolios(data || []);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PortfolioFormData) => {
    try {
      const portfolioData = {
        ...data,
        completion_date: data.completion_date ? data.completion_date.toISOString().split('T')[0] : null,
        updated_at: new Date().toISOString()
      };

      if (editingPortfolio) {
        const { error } = await supabase
          .from('portfolios')
          .update(portfolioData)
          .eq('id', editingPortfolio.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolios')
          .insert([portfolioData]);

        if (error) throw error;
      }

      await fetchPortfolios();
      setShowModal(false);
      setEditingPortfolio(null);
      reset();
    } catch (error) {
      console.error('Error saving portfolio:', error);
    }
  };

  const handleEdit = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this portfolio item?')) return;

    try {
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPortfolios();
    } catch (error) {
      console.error('Error deleting portfolio:', error);
    }
  };

  const togglePremium = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('portfolios')
        .update({ is_premium: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await fetchPortfolios();
    } catch (error) {
      console.error('Error updating portfolio premium status:', error);
    }
  };

  const filteredPortfolios = portfolios.filter(portfolio =>
    portfolio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portfolio.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portfolio.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portfolio.description.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Management</h1>
          <p className="text-gray-600">Manage your premium property portfolio</p>
        </div>
        <button
          onClick={() => {
            setEditingPortfolio(null);
            setShowModal(true);
            reset();
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Portfolio Item
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search portfolio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPortfolios.map((portfolio) => (
          <div key={portfolio.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative">
              <img
                src={portfolio.image}
                alt={portfolio.title}
                className="w-full h-48 object-cover"
              />
              {portfolio.is_premium && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <StarIcon className="h-3 w-3 mr-1" />
                  Premium
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{portfolio.title}</h3>
                  <p className="text-sm text-gray-600">{portfolio.location}</p>
                  <p className="text-sm text-blue-600 font-medium">{portfolio.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => togglePremium(portfolio.id, portfolio.is_premium)}
                    className={`p-1 rounded-full ${
                      portfolio.is_premium ? 'text-yellow-600 hover:text-yellow-700' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={portfolio.is_premium ? 'Remove from premium' : 'Mark as premium'}
                  >
                    <StarIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(portfolio)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(portfolio.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{portfolio.description}</p>

              {portfolio.completion_date && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">
                    Completed: {new Date(portfolio.completion_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Order: {portfolio.order_index}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  portfolio.is_premium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {portfolio.is_premium ? 'Premium' : 'Standard'}
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
                {editingPortfolio ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingPortfolio(null);
                  reset();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    Category *
                  </label>
                  <input
                    {...register('category')}
                    placeholder="e.g., Residential, Commercial, Agricultural"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
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
                    Completion Date
                  </label>
                  <input
                    type="date"
                    {...register('completion_date')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                    {...register('is_premium')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Premium Portfolio Item
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPortfolio(null);
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
                  {editingPortfolio ? 'Update Portfolio Item' : 'Add Portfolio Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioManagement;
