import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { World } from '../types';
import api from '../utils/api';
import Layout from '../components/layout';

const Dashboard: React.FC = () => {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorld, setNewWorld] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);

  //const { user } = useAuth();

  useEffect(() => {
    fetchWorlds();
  }, []);

  const fetchWorlds = async () => {
    try {
      const response = await api.get('/worlds');
      setWorlds(response.data);
    } catch (error) {
      console.error('Error fetching worlds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorld = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await api.post('/worlds', newWorld);
      setWorlds([response.data, ...worlds]);
      setNewWorld({ name: '', description: '' });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating world:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteWorld = async (worldId: string) => {
    if (!window.confirm('Are you sure you want to delete this world? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/worlds/${worldId}`);
      setWorlds(worlds.filter(world => world.id !== worldId));
    } catch (error) {
      console.error('Error deleting world:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading your worlds...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Worlds</h1>
            <p className="text-gray-600">Create and manage your fictional worlds</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            Create New World
          </button>
        </div>

        {worlds.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4a9.971 9.971 0 01.712-3.714M34 40v-4a9.971 9.971 0 01-.712-3.714M20 12a4 4 0 108 0v8a4 4 0 11-8 0v-8zM6 28a6 6 0 0112 0v4a6 6 0 01-12 0v-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No worlds yet</h3>
            <p className="text-gray-500 mb-4">Create your first world to start building your fictional universe.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              Create Your First World
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {worlds.map((world) => (
              <div key={world.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{world.name}</h3>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      world.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {world.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>

                {world.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{world.description}</p>
                )}

                <div className="text-xs text-gray-500 mb-4">
                  Created {new Date(world.createdAt).toLocaleDateString()}
                </div>

                <div className="flex justify-between items-center">
                  <Link
                    to={`/world/${world.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    Open World →
                  </Link>
                  <button
                    onClick={() => handleDeleteWorld(world.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create World Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New World</h2>
            
            <form onSubmit={handleCreateWorld} className="space-y-4">
              <div>
                <label htmlFor="worldName" className="block text-sm font-medium text-gray-700">
                  World Name *
                </label>
                <input
                  id="worldName"
                  type="text"
                  required
                  className="input mt-1"
                  placeholder="Enter world name"
                  value={newWorld.name}
                  onChange={(e) => setNewWorld({ ...newWorld, name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="worldDescription" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="worldDescription"
                  rows={3}
                  className="input mt-1"
                  placeholder="Describe your world (optional)"
                  value={newWorld.description}
                  onChange={(e) => setNewWorld({ ...newWorld, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewWorld({ name: '', description: '' });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn btn-primary"
                >
                  {creating ? 'Creating...' : 'Create World'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
