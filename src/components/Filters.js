import React, { useMemo, useCallback } from 'react';
import { useTasks } from '../contexts/TaskContext';

/**
 * Filters component to filter tasks based on completion status
 * @param {Object} props - Component props
 * @param {string} props.activeFilter - Currently active filter
 * @param {function} props.onFilterChange - Callback when filter changes
 */
const Filters = ({ activeFilter, onFilterChange }) => {
  const { taskStats, clearCompleted } = useTasks();

  // Memoized filter options with counts and icons
  const filterOptions = useMemo(() => [
    {
      key: 'all',
      label: 'All Tasks',
      icon: '📋',
      count: taskStats.total,
      colors: 'from-blue-500 to-indigo-600',
      hoverColors: 'hover:from-blue-600 hover:to-indigo-700'
    },
    {
      key: 'pending',
      label: 'Pending',
      icon: '⏳',
      count: taskStats.pending,
      colors: 'from-yellow-500 to-orange-500',
      hoverColors: 'hover:from-yellow-600 hover:to-orange-600'
    },
    {
      key: 'completed',
      label: 'Completed',
      icon: '✅',
      count: taskStats.completed,
      colors: 'from-green-500 to-emerald-500',
      hoverColors: 'hover:from-green-600 hover:to-emerald-600'
    }
  ], [taskStats]);

  // Memoized clear completed handler
  const handleClearCompleted = useCallback(() => {
    if (taskStats.completed > 0 && window.confirm(`Are you sure you want to delete ${taskStats.completed} completed task(s)?`)) {
      clearCompleted();
    }
  }, [clearCompleted, taskStats.completed]);

  return (
    <div className="glass rounded-2xl shadow-xl p-8 mb-8 backdrop-blur-lg border border-white/20">
      <div className="flex flex-col space-y-6">
        {/* Filter Title */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
            <span className="mr-3 text-3xl">🎈</span>
            Filter & Organize
          </h3>
          
          {/* Task Statistics */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-2 rounded-full font-semibold">
              <span className="mr-2">📋</span>
              <span className="font-bold">{taskStats.total}</span> Total
            </div>
            <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-2 rounded-full font-semibold">
              <span className="mr-2">⏳</span>
              <span className="font-bold">{taskStats.pending}</span> Pending
            </div>
            <div className="flex items-center bg-green-100 text-green-800 px-3 py-2 rounded-full font-semibold">
              <span className="mr-2">✅</span>
              <span className="font-bold">{taskStats.completed}</span> Done
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {filterOptions.map(({ key, label, icon, count, colors, hoverColors }) => (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className={`
                group relative overflow-hidden px-6 py-4 rounded-2xl font-bold transition-all duration-300 focus-ring
                ${activeFilter === key
                  ? `bg-gradient-to-r ${colors} text-white shadow-2xl transform scale-105 ring-4 ring-purple-200`
                  : `bg-white/70 text-gray-700 hover:bg-gradient-to-r ${colors} hover:text-white hover:shadow-xl hover:transform hover:scale-105 border border-gray-200`
                }
              `}
              aria-pressed={activeFilter === key}
              aria-label={`Filter by ${label.toLowerCase()}`}
            >
              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-3 text-2xl">{icon}</span>
                  <span className="text-lg">{label}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-black ${
                  activeFilter === key 
                    ? 'bg-white/30 text-white backdrop-blur-sm' 
                    : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800'
                }`}>
                  {count}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Additional Actions */}
        {taskStats.completed > 0 && (
          <div className="flex justify-center pt-2 border-t border-gray-200">
            <button
              onClick={handleClearCompleted}
              className="inline-flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200 focus-ring"
              aria-label={`Clear ${taskStats.completed} completed tasks`}
            >
              <span className="mr-2">🗑️</span>
              Clear {taskStats.completed} Completed Task{taskStats.completed !== 1 ? 's' : ''}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Filters);
