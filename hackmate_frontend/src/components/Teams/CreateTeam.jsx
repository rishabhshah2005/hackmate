import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../api/axios';
import { Users, Lock, Globe, Github, Link as LinkIcon } from 'lucide-react';

const CreateTeam = () => {
  const { hackathonId } = useParams();
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
    demo_url: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await api.post('/teams/create/', {
        ...formData,
        hackathon: hackathonId,
        leader: user.id
      });
      
      navigate(`/teams/${response.data.id}`);
    } catch (err) {
        console.log(err);
        
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ non_field_errors: ['An error occurred. Please try again.'] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create a New Team</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Fill out the form below to create your team for the hackathon.
        </p>
      </div>

      {errors.non_field_errors && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
          {errors.non_field_errors.map((error, idx) => (
            <p key={idx}>{error}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team Name */}
          <div className="col-span-1 md:col-span-2">
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
                className={`pl-10 block w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800`}
                placeholder="Awesome Team"
                required
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Team Description */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`block w-full rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800`}
              placeholder="Tell us about your team's goals and what you're looking for in teammates..."
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
            )}
          </div>

          {/* Team Settings */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Team Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Max Members */}
              <div>
                <label htmlFor="max_members" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Team Size
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

              {/* Is Recruiting */}
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

              {/* Is Private */}
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
          </div>

          {/* Project Details */}
          <div className="col-span-1 md:col-span-2">
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
                className={`block w-full rounded-lg border ${errors.project_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800`}
                placeholder="My Awesome Project"
              />
              {errors.project_name && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.project_name}</p>
              )}
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
                className={`block w-full rounded-lg border ${errors.project_description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800`}
                placeholder="Describe your project idea or what you're planning to build..."
              />
              {errors.project_description && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.project_description}</p>
              )}
            </div>

            {/* GitHub Repo */}
            <div className="mb-4">
              <label htmlFor="github_repo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GitHub Repository URL
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
                  className={`block w-full rounded-lg border ${errors.github_repo ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 pl-10`}
                  placeholder="https://github.com/username/repo"
                />
              </div>
              {errors.github_repo && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.github_repo}</p>
              )}
            </div>

            {/* Demo URL */}
            <div className="mb-4">
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
                  className={`block w-full rounded-lg border ${errors.demo_url ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 pl-10`}
                  placeholder="https://your-demo-site.com"
                />
              </div>
              {errors.demo_url && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.demo_url}</p>
              )}
            </div>
          </div>
        </div>

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
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : 'Create Team'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeam;