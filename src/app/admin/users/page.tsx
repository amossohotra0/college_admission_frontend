'use client';

import React, { useState } from 'react';
import { 
  useUsers, 
  useRoles,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useActivateUser,
  useDeactivateUser,
  useChangeUserRole
} from '@/hooks/useApi';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import RoleGuard from '@/components/ui/RoleGuard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Search,
  Filter
} from 'lucide-react';

export default function UserManagementPage() {
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: roles, isLoading: rolesLoading } = useRoles();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: '',
    password: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const activateUser = useActivateUser();
  const deactivateUser = useDeactivateUser();
  const changeUserRole = useChangeUserRole();

  const isLoading = usersLoading || rolesLoading;

  const handleCreateUser = () => {
    setSelectedUser(null);
    setFormData({
      email: '',
      first_name: '',
      last_name: '',
      role: '',
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role?.id || '',
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser.mutate(userId);
    }
  };

  const handleActivateUser = (userId: number) => {
    activateUser.mutate(userId);
  };

  const handleDeactivateUser = (userId: number) => {
    deactivateUser.mutate(userId);
  };

  const handleChangeRole = (userId: number, roleId: number) => {
    changeUserRole.mutate({ id: userId, roleId });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      updateUser.mutate({
        id: selectedUser.id,
        data: {
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          role: formData.role ? { id: parseInt(formData.role), role: '' } : undefined,
          ...(formData.password && { password: formData.password }),
        },
      });
    } else {
      createUser.mutate({
        ...formData,
        role: formData.role ? { id: parseInt(formData.role), role: '' } : undefined
      });
    }
    setIsModalOpen(false);
  };

  // Filter and search users
  const filteredUsers = Array.isArray(users) ? users.filter((user: any) => {
    const matchesSearch = searchTerm === '' || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === '' || 
      (user.role && user.role.role === roleFilter);
    
    return matchesSearch && matchesRole;
  }) : [];

  // Get user counts by role
  const userCountsByRole = Array.isArray(users) ? users.reduce((acc: any, user: any) => {
    if (user.role) {
      acc[user.role.role] = (acc[user.role.role] || 0) + 1;
    } else {
      acc['unassigned'] = (acc['unassigned'] || 0) + 1;
    }
    return acc;
  }, {}) : {};

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['admin']}>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <>
                {/* User Stats */}
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Users className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">{users?.length || 0}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Users className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Staff Users</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {(userCountsByRole['admin'] || 0) + 
                                 (userCountsByRole['admission_officer'] || 0) + 
                                 (userCountsByRole['reviewer'] || 0) + 
                                 (userCountsByRole['accountant'] || 0) + 
                                 (userCountsByRole['data_entry'] || 0)}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Users className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Applicants</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">{userCountsByRole['applicant'] || 0}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Users className="h-6 w-6 text-red-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Unassigned</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">{userCountsByRole['unassigned'] || 0}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="mt-8">
                  <div className="bg-white shadow rounded-lg p-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="w-full sm:w-auto">
                        <div className="flex items-center">
                          <Filter className="h-5 w-5 text-gray-400 mr-2" />
                          <select
                            className="block w-full sm:w-auto border-gray-300 rounded-md shadow-sm text-sm"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                          >
                            <option value="">All Roles</option>
                            {Array.isArray(roles) && roles.map((role: any) => (
                              <option key={role.id} value={role.role}>
                                {role.role}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleCreateUser}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                      </button>
                    </div>
                  </div>
                </div>

                {/* User List */}
                <div className="mt-8">
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">User List</h3>
                    </div>
                    <div className="border-t border-gray-200">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user: any) => (
                              <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.first_name} {user.last_name}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <select
                                    className="text-sm text-gray-900 border-gray-300 rounded-md"
                                    value={user.role?.id || ''}
                                    onChange={(e) => handleChangeRole(user.id, parseInt(e.target.value))}
                                  >
                                    <option value="">No Role</option>
                                    {Array.isArray(roles) && roles.map((role: any) => (
                                      <option key={role.id} value={role.id}>
                                        {role.role}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {user.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleEditUser(user)}
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                    {user.is_active ? (
                                      <button
                                        onClick={() => handleDeactivateUser(user.id)}
                                        className="text-yellow-600 hover:text-yellow-900"
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleActivateUser(user.id)}
                                        className="text-green-600 hover:text-green-900"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* User Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedUser ? 'Edit User' : 'Create User'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      id="role"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                    >
                      <option value="">Select Role</option>
                      {Array.isArray(roles) && roles.map((role: any) => (
                        <option key={role.id} value={role.id}>
                          {role.role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password {selectedUser && '(Leave blank to keep current)'}
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!selectedUser}
                    />
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  >
                    {selectedUser ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </RoleGuard>
    </ProtectedRoute>
  );
}