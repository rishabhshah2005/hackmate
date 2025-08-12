import React from 'react';
import { motion } from 'framer-motion';
import { Star, Github, Linkedin, MapPin, MessageCircle, UserPlus } from 'lucide-react';

const ParticipantCard = ({ participant, onInvite, onMessage }) => {
  const experienceColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
  };

  const getCompatibilityColor = (score) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-orange-600 dark:text-orange-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getCompatibilityBg = (score) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 80) return 'bg-blue-100 dark:bg-blue-900/20';
    if (score >= 70) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-gray-100 dark:bg-gray-700';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {participant.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {participant.name}
              </h3>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Star className="mr-1 h-3 w-3 fill-current text-yellow-500" />
                {participant.rating}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${experienceColors[participant.experience]}`}>
              {participant.experience}
            </span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          <MapPin className="mr-1 h-4 w-4" />
          {participant.location}
        </div>

        {/* Compatibility Score */}
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCompatibilityBg(participant.compatibility)} ${getCompatibilityColor(participant.compatibility)}`}>
          <Target className="mr-1 h-3 w-3" />
          {participant.compatibility}% Match
        </div>
      </div>

      {/* Bio */}
      <div className="px-6 pb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {participant.bio}
        </p>
      </div>

      {/* Skills */}
      <div className="px-6 pb-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {participant.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs"
            >
              {skill}
            </span>
          ))}
          {participant.skills.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs">
              +{participant.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Complementary Skills */}
      {participant.complementarySkills && participant.complementarySkills.length > 0 && (
        <div className="px-6 pb-4">
          <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
            Complementary Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {participant.complementarySkills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md text-xs border border-green-200 dark:border-green-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
        <div className="flex space-x-2">
          {participant.github && (
            <a
              href={participant.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          <button
            onClick={() => onMessage?.(participant)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={() => onInvite?.(participant)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center"
        >
          <UserPlus className="mr-1 h-4 w-4" />
          Invite
        </button>
      </div>
    </motion.div>
  );
};

export default ParticipantCard;
