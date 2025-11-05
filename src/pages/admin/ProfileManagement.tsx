import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  BuildingOffice2Icon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  GlobeAltIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { supabase, Profile } from '../../lib/supabase';

const schema = yup.object({
  company_name: yup.string().required('Company name is required'),
  description: yup.string().required('Description is required'),
  logo: yup.string().url('Must be a valid URL').required('Logo URL is required'),
  contact_info: yup.object({
    phone: yup.string().required('Phone is required'),
    email: yup.string().email('Must be a valid email').required('Email is required'),
    address: yup.string().required('Address is required'),
    website: yup.string().url('Must be a valid URL').nullable()
  }).required(),
  social_media: yup.object({
    facebook: yup.string().url('Must be a valid URL').nullable(),
    twitter: yup.string().url('Must be a valid URL').nullable(),
    linkedin: yup.string().url('Must be a valid URL').nullable(),
    instagram: yup.string().url('Must be a valid URL').nullable()
  }).default({}),
  is_active: yup.boolean().default(true)
});

type ProfileFormData = {
  company_name: string;
  description: string;
  logo: string;
  contact_info: {
    phone: string;
    email: string;
    address: string;
    website?: string | null;
  };
  social_media: {
    facebook?: string | null;
    twitter?: string | null;
    linkedin?: string | null;
    instagram?: string | null;
  };
  is_active: boolean;
};

const ProfileManagement: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ProfileFormData>();

  const watchedLogo = watch('logo');

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      reset({
        company_name: profile.company_name,
        description: profile.description,
        logo: profile.logo,
        contact_info: profile.contact_info,
        social_media: profile.social_media || {},
        is_active: profile.is_active
      });
    }
  }, [profile, reset]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error;
      }
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setSaving(true);
      const profileData = {
        ...data,
        updated_at: new Date().toISOString()
      };

      if (profile) {
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', profile.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert([profileData]);

        if (error) throw error;
      }

      await fetchProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      reset({
        company_name: profile.company_name,
        description: profile.description,
        logo: profile.logo,
        contact_info: profile.contact_info,
        social_media: profile.social_media || {},
        is_active: profile.is_active
      });
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-600">Manage your company information and branding</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Company Information</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  {...register('company_name')}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                  }`}
                />
                {errors.company_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.company_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo URL *
                </label>
                <input
                  {...register('logo')}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                  }`}
                />
                {errors.logo && (
                  <p className="text-red-500 text-sm mt-1">{errors.logo.message}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      {...register('contact_info.phone')}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                    {errors.contact_info?.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.contact_info.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      {...register('contact_info.email')}
                      type="email"
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                    {errors.contact_info?.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.contact_info.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    {...register('contact_info.address')}
                    rows={2}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                    }`}
                  />
                  {errors.contact_info?.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.contact_info.address.message}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    {...register('contact_info.website')}
                    type="url"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                    }`}
                  />
                  {errors.contact_info?.website && (
                    <p className="text-red-500 text-sm mt-1">{errors.contact_info.website.message}</p>
                  )}
                </div>
              </div>

              {/* Social Media */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Facebook
                    </label>
                    <input
                      {...register('social_media.facebook')}
                      type="url"
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                    {errors.social_media?.facebook && (
                      <p className="text-red-500 text-sm mt-1">{errors.social_media.facebook.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Twitter
                    </label>
                    <input
                      {...register('social_media.twitter')}
                      type="url"
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                    {errors.social_media?.twitter && (
                      <p className="text-red-500 text-sm mt-1">{errors.social_media.twitter.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn
                    </label>
                    <input
                      {...register('social_media.linkedin')}
                      type="url"
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                    {errors.social_media?.linkedin && (
                      <p className="text-red-500 text-sm mt-1">{errors.social_media.linkedin.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram
                    </label>
                    <input
                      {...register('social_media.instagram')}
                      type="url"
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                    {errors.social_media?.instagram && (
                      <p className="text-red-500 text-sm mt-1">{errors.social_media.instagram.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Active Status */}
              <div className="border-t pt-6">
                <div className="flex items-center">
                  <input
                    {...register('is_active')}
                    type="checkbox"
                    disabled={!isEditing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Active Profile
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    <XMarkIcon className="h-5 w-5 mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-5 w-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
            
            <div className="text-center">
              {watchedLogo && (
                <img
                  src={watchedLogo}
                  alt="Company Logo"
                  className="mx-auto h-20 w-20 object-contain mb-4"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {watch('company_name') || 'Company Name'}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                {watch('description') || 'Company description will appear here'}
              </p>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  {watch('contact_info.phone') || 'Phone number'}
                </div>
                <div className="flex items-center justify-center">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {watch('contact_info.email') || 'Email address'}
                </div>
                <div className="flex items-center justify-center">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {watch('contact_info.address') || 'Address'}
                </div>
                {watch('contact_info.website') && (
                  <div className="flex items-center justify-center">
                    <GlobeAltIcon className="h-4 w-4 mr-2" />
                    <a 
                      href={watch('contact_info.website') || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>
              
              {/* Social Media Icons */}
              <div className="flex justify-center space-x-3 mt-4">
                {watch('social_media.facebook') && (
                  <a 
                    href={watch('social_media.facebook') || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ShareIcon className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
