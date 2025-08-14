import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../api/axios';
import { Users, Lock, Globe, Github, Link as LinkIcon, Search, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreateTeam = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    max_members: 4,
    is_recruiting: true,
    is_private: false,
    project_name: '',
    project_description: '',
    github_repo: '',
    demo_url: '',
    hackathon: null
  });

  // Hackathon search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Handle hackathon search
  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await api.post('/teams/get_hackathons/', { query });
      setSearchResults(response.data.answer);
    } catch (error) {
      console.error('Error searching hackathons:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Select a hackathon
  const selectHackathon = (hackathon) => {
    setFormData({ ...formData, hackathon: hackathon.id });
    setSearchQuery(hackathon.title);
    setShowResults(false);
  };

  // Form handling
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/teams/create/', formData);
      navigate(`/teams/${response.data.id}`);
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${isDark ? 'dark' : ''}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create a New Team</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Build your dream team for an upcoming hackathon
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hackathon Search */}
        <div className="relative">
          <label htmlFor="hackathon-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Hackathon *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="hackathon-search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              onFocus={() => setShowResults(true)}
              className="pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
              placeholder="Search for a hackathon..."
              required
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFormData({ ...formData, hackathon: null });
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>

          <AnimatePresence>
            {showResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto"
              >
                {searchResults.map((hackathon) => (
                  <div
                    key={hackathon.id}
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                    onClick={() => selectHackathon(hackathon)}
                  >
                    <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <span className="text-gray-900 dark:text-white">{hackathon.title}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Team Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Team Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
              placeholder="Awesome Team"
              required
            />
          </div>
        </div>

        {/* Team Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Team Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
            placeholder="What makes your team special? What skills are you looking for?"
          />
        </div>

        {/* Team Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Max Members */}
          <div>
            <label htmlFor="max_members" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team Size
            </label>
            <select
              id="max_members"
              name="max_members"
              value={formData.max_members}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
            >
              {[2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} members</option>
              ))}
            </select>
          </div>

          {/* Recruiting Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_recruiting"
              name="is_recruiting"
              checked={formData.is_recruiting}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="is_recruiting" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Actively recruiting
            </label>
          </div>

          {/* Privacy Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_private"
              name="is_private"
              checked={formData.is_private}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="is_private" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Private team
            </label>
            <div className="ml-2 text-gray-400">
              {formData.is_private ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
            </div>
          </div>
        </div>

        {/* Project Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Details</h2>
          
          {/* Project Name */}
          <div className="mb-4">
            <label htmlFor="project_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Name
            </label>
            <input
              type="text"
              id="project_name"
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
              placeholder="Our Amazing Project"
            />
          </div>

          {/* Project Description */}
          <div className="mb-4">
            <label htmlFor="project_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Description
            </label>
            <textarea
              id="project_description"
              name="project_description"
              value={formData.project_description}
              onChange={handleChange}
              rows={3}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
              placeholder="Describe your project idea or goals..."
            />
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* GitHub Repo */}
            <div>
              <label htmlFor="github_repo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GitHub Repository
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Github className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  id="github_repo"
                  name="github_repo"
                  value={formData.github_repo}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>

            {/* Demo URL */}
            <div>
              <label htmlFor="demo_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Demo URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  id="demo_url"
                  name="demo_url"
                  value={formData.demo_url}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
                  placeholder="https://your-demo-site.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            Create Team
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeam;