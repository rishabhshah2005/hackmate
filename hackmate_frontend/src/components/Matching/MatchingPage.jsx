import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Sparkles, Filter, Search, SlidersHorizontal, Target, Zap } from 'lucide-react';
import ParticipantCard from './ParticipantCard';
import { mockParticipants } from '../../data/mockData';

const MatchingPage = () => {
  const [view, setView] = useState('matches');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const allSkills = Array.from(new Set(mockParticipants.flatMap(p => p.skills)));

  const experienceOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const filteredParticipants = mockParticipants
    .filter(participant => {
      const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.bio.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSkills = selectedSkills.length === 0 ||
        selectedSkills.some(skill => participant.skills.includes(skill));
      const matchesExperience = experienceFilter === 'all' || participant.experience === experienceFilter;
      const matchesLocation = !locationFilter ||
        participant.location.toLowerCase().includes(locationFilter.toLowerCase());

      return matchesSearch && matchesSkills && matchesExperience && matchesLocation;
    })
    .sort((a, b) => view === 'matches' ? b.compatibility - a.compatibility : 0);

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSkills([]);
    setExperienceFilter('all');
    setLocationFilter('');
  };

  const bestMatches = filteredParticipants.filter(p => p.compatibility >= 80);
  const goodMatches = filteredParticipants.filter(p => p.compatibility >= 60 && p.compatibility < 80);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Find Your Perfect Teammates
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 dark:text-gray-400"
        >
          Discover talented individuals who complement your skills
        </motion.p>
      </div>

      {/* View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setView('matches')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${view === 'matches'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Best Matches
          </button>
          <button
            onClick={() => setView('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${view === 'all'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            <Users className="mr-2 h-4 w-4" />
            All Participants
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        {/* Main Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search participants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Experience Filter */}
          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {experienceOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Location Filter */}
          <input
            type="text"
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />

          {/* Skills Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Skills
          </button>
        </div>

        {/* Advanced Skills Filter */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 dark:border-gray-700 pt-6"
          >
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Filter by Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {allSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${selectedSkills.includes(skill)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {(searchTerm || selectedSkills.length > 0 || experienceFilter !== 'all' || locationFilter) && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 text-sm font-medium"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Results */}
      <div className="space-y-8">
        {view === 'matches' && (
          <>
            {bestMatches.length > 0 && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Perfect Matches ({bestMatches.length})
                    </h2>
                  </div>
                  <div className="ml-auto">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                      80%+ Compatibility
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bestMatches.map((participant, index) => (
                    <motion.div
                      key={participant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ParticipantCard
                        participant={participant}
                        onInvite={(p) => console.log('Invite:', p.name)}
                        onMessage={(p) => console.log('Message:', p.name)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {goodMatches.length > 0 && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Good Matches ({goodMatches.length})
                    </h2>
                  </div>
                  <div className="ml-auto">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                      60%+ Compatibility
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {goodMatches.map((participant, index) => (
                    <motion.div
                      key={participant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ParticipantCard
                        participant={participant}
                        onInvite={(p) => console.log('Invite:', p.name)}
                        onMessage={(p) => console.log('Message:', p.name)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {view === 'all' && (
          <div>
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                All Participants ({filteredParticipants.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParticipants.map((participant, index) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ParticipantCard
                    participant={participant}
                    onInvite={(p) => console.log('Invite:', p.name)}
                    onMessage={(p) => console.log('Message:', p.name)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredParticipants.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <Users className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No participants found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MatchingPage;