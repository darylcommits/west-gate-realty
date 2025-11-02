import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ShareIcon,
  EyeIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import { supabase, Settings } from '../../lib/supabase';

const schema = yup.object({
  site_title: yup.string().required('Site title is required'),
  site_description: yup.string().required('Site description is required'),
  site_logo: yup.string().url('Must be a valid URL').required('Site logo URL is required'),
  contact_email: yup.string().email('Must be a valid email').required('Contact email is required'),
  contact_phone: yup.string().required('Contact phone is required'),
  address: yup.string().required('Address is required'),
  social_media: yup.object({
    facebook: yup.string().url('Must be a valid URL').nullable(),
    twitter: yup.string().url('Must be a valid URL').nullable(),
    linkedin: yup.string().url('Must be a valid URL').nullable(),
    instagram: yup.string().url('Must be a valid URL').nullable()
  }).default({}),
  seo_settings: yup.object({
    meta_title: yup.string().nullable(),
    meta_description: yup.string().nullable(),
    meta_keywords: yup.string().nullable()
  }).default({}),
  theme_settings: yup.object({
    primary_color: yup.string().required('Primary color is required'),
    secondary_color: yup.string().required('Secondary color is required'),
    accent_color: yup.string().required('Accent color is required')
  }).required()
});

type SettingsFormData = {
  site_title: string;
  site_description: string;
  site_logo: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  social_media: {
    facebook?: string | null;
    twitter?: string | null;
    linkedin?: string | null;
    instagram?: string | null;
  };
  seo_settings: {
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;
  };
  theme_settings: {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
  };
};

const SettingsManagement: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<SettingsFormData>();

  const watchedLogo = watch('site_logo');
  const watchedPrimaryColor = watch('theme_settings.primary_color');
  const watchedSecondaryColor = watch('theme_settings.secondary_color');
  const watchedAccentColor = watch('theme_settings.accent_color');

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      reset({
        site_title: settings.site_title,
        site_description: settings.site_description,
        site_logo: settings.site_logo,
        contact_email: settings.contact_email,
        contact_phone: settings.contact_phone,
        address: settings.address,
        social_media: settings.social_media || {},
        seo_settings: settings.seo_settings || {},
        theme_settings: settings.theme_settings || {
          primary_color: '#1e40af',
          secondary_color: '#f59e0b',
          accent_color: '#10b981'
        }
      });
    }
  }, [settings, reset]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error;
      }
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SettingsFormData) => {
    try {
      setSaving(true);
      const settingsData = {
        ...data,
        updated_at: new Date().toISOString()
      };

      if (settings) {
        const { error } = await supabase
          .from('settings')
          .update(settingsData)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('settings')
          .insert([settingsData]);

        if (error) throw error;
      }

      await fetchSettings();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (settings) {
      reset({
        site_title: settings.site_title,
        site_description: settings.site_description,
        site_logo: settings.site_logo,
        contact_email: settings.contact_email,
        contact_phone: settings.contact_phone,
        address: settings.address,
        social_media: settings.social_media || {},
        seo_settings: settings.seo_settings || {},
        theme_settings: settings.theme_settings || {
          primary_color: '#1e40af',
          secondary_color: '#f59e0b',
          accent_color: '#10b981'
        }
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
          <h1 className="text-2xl font-bold text-gray-900">Website Settings</h1>
          <p className="text-gray-600">Manage your website configuration and appearance</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit Settings
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Site Information */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <GlobeAltIcon className="h-5 w-5 mr-2" />
                  Site Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Site Title *
                    </label>
                    <input
                      {...register('site_title')}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                    {errors.site_title && (
                      <p className="text-red-500 text-sm mt-1">{errors.site_title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Site Description *
                    </label>
                    <textarea
                      {...register('site_description')}
                      rows={3}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                    {errors.site_description && (
                      <p className="text-red-500 text-sm mt-1">{errors.site_description.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Site Logo URL *
                    </label>
                    <input
                      {...register('site_logo')}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                    {errors.site_logo && (
                      <p className="text-red-500 text-sm mt-1">{errors.site_logo.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email *
                    </label>
                    <input
                      {...register('contact_email')}
                      type="email"
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                    {errors.contact_email && (
                      <p className="text-red-500 text-sm mt-1">{errors.contact_email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      {...register('contact_phone')}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                    {errors.contact_phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.contact_phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    {...register('address')}
                    rows={2}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>
              </div>

              {/* Social Media */}
              <div className="border-t pt-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <ShareIcon className="h-5 w-5 mr-2" />
                  Social Media
                </h3>
                
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
                  </div>
                </div>
              </div>

              {/* SEO Settings */}
              <div className="border-t pt-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <EyeIcon className="h-5 w-5 mr-2" />
                  SEO Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title
                    </label>
                    <input
                      {...register('seo_settings.meta_title')}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      {...register('seo_settings.meta_description')}
                      rows={2}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Keywords
                    </label>
                    <input
                      {...register('seo_settings.meta_keywords')}
                      disabled={!isEditing}
                      placeholder="real estate, properties, ilocos, philippines"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="border-t pt-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <SwatchIcon className="h-5 w-5 mr-2" />
                  Theme Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Color *
                    </label>
                    <input
                      {...register('theme_settings.primary_color')}
                      type="color"
                      disabled={!isEditing}
                      className={`w-full h-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Color *
                    </label>
                    <input
                      {...register('theme_settings.secondary_color')}
                      type="color"
                      disabled={!isEditing}
                      className={`w-full h-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Accent Color *
                    </label>
                    <input
                      {...register('theme_settings.accent_color')}
                      type="color"
                      disabled={!isEditing}
                      className={`w-full h-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                  </div>
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
                        Save Settings
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Theme Preview</h2>
            
            <div className="space-y-4">
              {/* Logo Preview */}
              <div className="text-center">
                {watchedLogo && (
                  <img
                    src={watchedLogo}
                    alt="Site Logo"
                    className="mx-auto h-12 w-12 object-contain mb-2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <h3 className="text-lg font-bold" style={{ color: watchedPrimaryColor }}>
                  {watch('site_title') || 'Site Title'}
                </h3>
              </div>
              
              {/* Color Preview */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: watchedPrimaryColor }}
                  ></div>
                  <span className="text-sm text-gray-600">Primary</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: watchedSecondaryColor }}
                  ></div>
                  <span className="text-sm text-gray-600">Secondary</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: watchedAccentColor }}
                  ></div>
                  <span className="text-sm text-gray-600">Accent</span>
                </div>
              </div>
              
              {/* Sample Button */}
              <div className="pt-4">
                <button 
                  className="w-full py-2 px-4 rounded text-white font-medium"
                  style={{ backgroundColor: watchedPrimaryColor }}
                >
                  Sample Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;
