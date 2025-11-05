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
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { supabase, Certification } from '../../lib/supabase';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  image: yup.string().url('Must be a valid URL').required('Image URL is required'),
  issuer: yup.string().required('Issuer is required'),
  issue_date: yup.date().required('Issue date is required'),
  expiry_date: yup.date().nullable(),
  verification_url: yup.string().url('Must be a valid URL').nullable(),
  is_active: yup.boolean().default(true),
  order_index: yup.number().min(0).default(0)
});

type CertificationFormData = {
  title: string;
  description: string;
  image: string;
  issuer: string;
  issue_date: Date;
  expiry_date: Date | null;
  verification_url: string | null;
  is_active: boolean;
  order_index: number;
};

const CertificationsManagement: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CertificationFormData>();

  useEffect(() => {
    fetchCertifications();
  }, []);

  useEffect(() => {
    if (editingCertification) {
      reset({
        title: editingCertification.title,
        description: editingCertification.description,
        image: editingCertification.image,
        issuer: editingCertification.issuer,
        issue_date: new Date(editingCertification.issue_date),
        expiry_date: editingCertification.expiry_date ? new Date(editingCertification.expiry_date) : null,
        verification_url: editingCertification.verification_url || '',
        is_active: editingCertification.is_active,
        order_index: editingCertification.order_index
      });
    }
  }, [editingCertification, reset]);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setCertifications(data || []);
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CertificationFormData) => {
    try {
      const certificationData = {
        ...data,
        issue_date: data.issue_date.toISOString().split('T')[0],
        expiry_date: data.expiry_date ? data.expiry_date.toISOString().split('T')[0] : null,
        verification_url: data.verification_url || null,
        updated_at: new Date().toISOString()
      };

      if (editingCertification) {
        const { error } = await supabase
          .from('certifications')
          .update(certificationData)
          .eq('id', editingCertification.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('certifications')
          .insert([certificationData]);

        if (error) throw error;
      }

      await fetchCertifications();
      setShowModal(false);
      setEditingCertification(null);
      reset();
    } catch (error) {
      console.error('Error saving certification:', error);
    }
  };

  const handleEdit = (certification: Certification) => {
    setEditingCertification(certification);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) return;

    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCertifications();
    } catch (error) {
      console.error('Error deleting certification:', error);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('certifications')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await fetchCertifications();
    } catch (error) {
      console.error('Error updating certification status:', error);
    }
  };

  const filteredCertifications = certifications.filter(certification =>
    certification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    certification.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    certification.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isExpiringSoon = (expiryDate: string | null | undefined) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const isExpired = (expiryDate: string | null | undefined) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Certifications Management</h1>
          <p className="text-gray-600">Manage your legitimacy certifications and credentials</p>
        </div>
        <button
          onClick={() => {
            setEditingCertification(null);
            setShowModal(true);
            reset();
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Certification
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search certifications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertifications.map((certification) => (
          <div key={certification.id} className={`bg-white rounded-lg shadow overflow-hidden border-l-4 ${
            certification.is_active ? 'border-green-500' : 'border-gray-300'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <img
                  src={certification.image}
                  alt={certification.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleActive(certification.id, certification.is_active)}
                    className={`p-1 rounded-full ${
                      certification.is_active ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={certification.is_active ? 'Hide certification' : 'Show certification'}
                  >
                    {certification.is_active ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(certification)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(certification.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{certification.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{certification.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Issuer:</span>
                  <span className="text-gray-900">{certification.issuer}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Issued:</span>
                  <span className="text-gray-900">
                    {new Date(certification.issue_date).toLocaleDateString()}
                  </span>
                </div>
                {certification.expiry_date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Expires:</span>
                    <span className={`${
                      isExpired(certification.expiry_date) ? 'text-red-600' :
                      isExpiringSoon(certification.expiry_date) ? 'text-yellow-600' :
                      'text-gray-900'
                    }`}>
                      {new Date(certification.expiry_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {certification.verification_url && (
                <a
                  href={certification.verification_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
                  Verify Online
                </a>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Order: {certification.order_index}
                </span>
                <div className="flex items-center space-x-2">
                  {isExpired(certification.expiry_date) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Expired
                    </span>
                  )}
                  {isExpiringSoon(certification.expiry_date) && !isExpired(certification.expiry_date) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Expiring Soon
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    certification.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {certification.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
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
                {editingCertification ? 'Edit Certification' : 'Add Certification'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingCertification(null);
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
                    Issuer *
                  </label>
                  <input
                    {...register('issuer')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.issuer && (
                    <p className="text-red-500 text-sm mt-1">{errors.issuer.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    {...register('issue_date')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.issue_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.issue_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    {...register('expiry_date')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification URL
                </label>
                <input
                  {...register('verification_url')}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                    Active Certification
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCertification(null);
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
                  {editingCertification ? 'Update Certification' : 'Add Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationsManagement;
