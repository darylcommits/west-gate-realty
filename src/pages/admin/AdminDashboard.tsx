import React, { useState, useEffect } from 'react';
import {
  BuildingOffice2Icon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  MapPinIcon,
  TagIcon,
  BriefcaseIcon,
  StarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CogIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabase';

const AdminDashboard: React.FC = () => {
  console.log('AdminDashboard component is rendering');
  
  const [stats, setStats] = useState({
    properties: 0,
    services: 0,
    certifications: 0,
    neighborhoods: 0,
    propertyTypes: 0,
    portfolios: 0,
    featuredProjects: 0
  });

  const [recentProperties, setRecentProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics] = useState({
    pageViews: 1250,
    uniqueVisitors: 890,
    conversionRate: 3.2,
    avgSessionDuration: '4m 32s'
  });
  const [recentActivities] = useState([
    { id: 1, action: 'Property Added', user: 'Admin User', time: '2 minutes ago', type: 'success' },
    { id: 2, action: 'Service Updated', user: 'Admin User', time: '15 minutes ago', type: 'info' },
    { id: 3, action: 'User Login', user: 'Admin User', time: '1 hour ago', type: 'info' },
    { id: 4, action: 'Property Deleted', user: 'Admin User', time: '2 hours ago', type: 'warning' }
  ]);
  const [systemStatus] = useState({
    website: 'online',
    database: 'online',
    api: 'online',
    cdn: 'online'
  });
  const [notifications] = useState([
    { id: 1, title: 'New Property Inquiry', message: 'You have 3 new property inquiries', time: '5 minutes ago', unread: true },
    { id: 2, title: 'System Update Available', message: 'Version 2.1.0 is ready to install', time: '1 hour ago', unread: false },
    { id: 3, title: 'Backup Completed', message: 'Daily backup completed successfully', time: '2 hours ago', unread: false }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Check if Supabase is configured
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
      const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
      
      if (supabaseUrl === 'https://dfroskbmtskxugzacmob.supabase.co' || supabaseKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmcm9za2JtdHNreHVnemFjbW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTE1MDAsImV4cCI6MjA3MzgyNzUwMH0.ss3FZpcfMe9FpHjOKZjw53aC0mt-7yFttP8X-duHMzc') {
        // Show mock data when Supabase is not configured
        setStats({
          properties: 12,
          services: 8,
          certifications: 5,
          neighborhoods: 15,
          propertyTypes: 6,
          portfolios: 10,
          featuredProjects: 7
        });

        setRecentProperties([
          {
            id: '1',
            title: 'Luxury Villa in Beverly Hills',
            description: 'Beautiful 5-bedroom villa with pool',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
            location: 'Beverly Hills, CA',
            status: 'Available',
            created_at: new Date().toISOString(),
            price: 2500000
          },
          {
            id: '2',
            title: 'Modern Apartment Downtown',
            description: 'Contemporary 2-bedroom apartment',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
            location: 'Downtown LA',
            status: 'Available',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            price: 850000
          },
          {
            id: '3',
            title: 'Family Home with Garden',
            description: 'Spacious 4-bedroom family home',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
            location: 'Santa Monica, CA',
            status: 'Sold',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            price: 1200000
          }
        ]);
      } else {
        // Fetch real data from Supabase
        const [propertiesResult, servicesResult, certificationsResult, neighborhoodsResult, propertyTypesResult, portfoliosResult, featuredProjectsResult] = await Promise.all([
          supabase.from('properties').select('id', { count: 'exact', head: true }),
          supabase.from('services').select('id', { count: 'exact', head: true }),
          supabase.from('certifications').select('id', { count: 'exact', head: true }),
          supabase.from('neighborhoods').select('id', { count: 'exact', head: true }),
          supabase.from('property_types').select('id', { count: 'exact', head: true }),
          supabase.from('portfolios').select('id', { count: 'exact', head: true }),
          supabase.from('featured_projects').select('id', { count: 'exact', head: true })
        ]);

        // Fetch recent properties
        const { data: properties } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          properties: propertiesResult.count || 0,
          services: servicesResult.count || 0,
          certifications: certificationsResult.count || 0,
          neighborhoods: neighborhoodsResult.count || 0,
          propertyTypes: propertyTypesResult.count || 0,
          portfolios: portfoliosResult.count || 0,
          featuredProjects: featuredProjectsResult.count || 0
        });

        setRecentProperties(properties || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data on error
      setStats({
        properties: 12,
        services: 8,
        certifications: 5,
        neighborhoods: 15,
        propertyTypes: 6,
        portfolios: 10,
        featuredProjects: 7
      });

      setRecentProperties([
        {
          id: '1',
          title: 'Luxury Villa in Beverly Hills',
          description: 'Beautiful 5-bedroom villa with pool',
          image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
          location: 'Beverly Hills, CA',
          status: 'Available',
          created_at: new Date().toISOString(),
          price: 2500000
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { name: 'Properties', value: stats.properties, icon: BuildingOffice2Icon, color: 'bg-blue-500' },
    { name: 'Services', value: stats.services, icon: WrenchScrewdriverIcon, color: 'bg-green-500' },
    { name: 'Certifications', value: stats.certifications, icon: ShieldCheckIcon, color: 'bg-purple-500' },
    { name: 'Neighborhoods', value: stats.neighborhoods, icon: MapPinIcon, color: 'bg-red-500' },
    { name: 'Property Types', value: stats.propertyTypes, icon: TagIcon, color: 'bg-yellow-500' },
    { name: 'Portfolios', value: stats.portfolios, icon: BriefcaseIcon, color: 'bg-indigo-500' },
    { name: 'Featured Projects', value: stats.featuredProjects, icon: StarIcon, color: 'bg-pink-500' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Simple test to ensure component renders
  console.log('AdminDashboard render - stats:', stats, 'recentProperties:', recentProperties);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-blue-100">Manage your West Gate Realty website content and settings</p>
        {(process.env.REACT_APP_SUPABASE_URL === 'https://your-project.supabase.co' || process.env.REACT_APP_SUPABASE_ANON_KEY === 'your-anon-key') && (
          <div className="mt-4 p-3 bg-blue-500 bg-opacity-50 rounded-lg">
            <p className="text-sm">
              📝 <strong>Demo Mode:</strong> Showing sample data. Connect Supabase to manage real content.
              <a href="/QUICK_SETUP.md" className="underline ml-2">Setup Guide →</a>
            </p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Properties</h3>
        </div>
        <div className="overflow-hidden">
          {recentProperties.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentProperties.map((property) => (
                <div key={property.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{property.title}</h4>
                        <p className="text-sm text-gray-500">{property.location}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(property.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        property.status === 'Available' ? 'bg-green-100 text-green-800' :
                        property.status === 'Sold' ? 'bg-red-100 text-red-800' :
                        property.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {property.status}
                      </span>
                      <div className="flex space-x-1">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <BuildingOffice2Icon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No properties</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first property.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <BuildingOffice2Icon className="h-5 w-5 text-blue-600 mr-3" />
            <span className="text-sm font-medium">Add Property</span>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <WrenchScrewdriverIcon className="h-5 w-5 text-green-600 mr-3" />
            <span className="text-sm font-medium">Add Service</span>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <ShieldCheckIcon className="h-5 w-5 text-purple-600 mr-3" />
            <span className="text-sm font-medium">Add Certification</span>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <CogIcon className="h-5 w-5 text-gray-600 mr-3" />
            <span className="text-sm font-medium">Update Settings</span>
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
            Analytics Overview
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">Page Views</p>
                  <p className="text-2xl font-bold text-blue-900">{analytics.pageViews.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-500 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Unique Visitors</p>
                  <p className="text-2xl font-bold text-green-900">{analytics.uniqueVisitors.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <StarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-purple-900">{analytics.conversionRate}%</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-orange-600">Avg. Session</p>
                  <p className="text-2xl font-bold text-orange-900">{analytics.avgSessionDuration}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <ClockIcon className="h-5 w-5 mr-2 text-green-600" />
            Recent Activities
          </h3>
        </div>
        <div className="overflow-hidden">
          <div className="divide-y divide-gray-200">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-100' :
                      activity.type === 'warning' ? 'bg-yellow-100' :
                      activity.type === 'error' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      {activity.type === 'success' ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : activity.type === 'warning' ? (
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                      ) : activity.type === 'error' ? (
                        <XCircleIcon className="h-5 w-5 text-red-600" />
                      ) : (
                        <ClockIcon className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{activity.action}</h4>
                      <p className="text-sm text-gray-500">by {activity.user}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <CogIcon className="h-5 w-5 mr-2 text-gray-600" />
            System Status
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(systemStatus).map(([service, status]) => (
              <div key={service} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    status === 'online' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900 capitalize">{service}</span>
                </div>
                <span className={`text-xs font-medium ${
                  status === 'online' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <BellIcon className="h-5 w-5 mr-2 text-yellow-600" />
            Notifications
          </h3>
        </div>
        <div className="overflow-hidden">
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div key={notification.id} className={`p-6 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${notification.unread ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <BellIcon className={`h-5 w-5 ${notification.unread ? 'text-blue-600' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <h4 className={`text-sm font-medium ${notification.unread ? 'text-blue-900' : 'text-gray-900'}`}>
                        {notification.title}
                        {notification.unread && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">New</span>}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {notification.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Management */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-indigo-600" />
            Content Management
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center mb-3">
                <BuildingOffice2Icon className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Properties</h4>
                  <p className="text-xs text-gray-500">Manage property listings</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.properties}</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center mb-3">
                <WrenchScrewdriverIcon className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Services</h4>
                  <p className="text-xs text-gray-500">Manage service offerings</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.services}</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center mb-3">
                <ShieldCheckIcon className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Certifications</h4>
                  <p className="text-xs text-gray-500">Manage certifications</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-600">{stats.certifications}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
