import React, { useMemo } from 'react';
import { useTasks } from '../contexts/TaskContext';
import TaskItem from './TaskItem';

/**
 * TaskList component for displaying filtered tasks
 * @param {Object} props - Component props
 * @param {string} props.filter - Current filter ('all', 'pending', 'completed')
 */
const TaskList = ({ filter }) => {
  const { getFilteredTasks, taskStats } = useTasks();

  // Memoized filtered tasks to prevent unnecessary recalculations
  const filteredTasks = useMemo(() => {
    return getFilteredTasks(filter);
  }, [getFilteredTasks, filter]);

  // Memoized empty state configuration
  const emptyStateConfig = useMemo(() => {
    const configs = {
      all: {
        icon: '📝',
        title: 'No tasks yet',
        message: 'Create your first task to get started!',
        suggestion: 'Add a task above to begin organizing your work.'
      },
      pending: {
        icon: '🎉',
        title: 'All caught up!',
        message: 'No pending tasks remaining.',
        suggestion: taskStats.total > 0 
          ? 'Great job completing all your tasks!' 
          : 'Add some tasks to see them here.'
      },
      completed: {
        icon: '⏳',
        title: 'No completed tasks',
        message: 'Tasks you complete will appear here.',
        suggestion: 'Mark some tasks as done to see your progress!'
      }
    };
    return configs[filter] || configs.all;
  }, [filter, taskStats.total]);

  // Empty state component
  const EmptyState = ({ config }) => (
    <div className="text-center py-16 px-8">
      <div className="max-w-md mx-auto">
        <div className="text-8xl mb-6 float-animation">{config.icon}</div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          {config.title}
        </h3>
        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
          {config.message}
        </p>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-purple-100">
          <p className="text-purple-700 font-medium flex items-center justify-center">
            <span className="mr-2">💡</span>
            {config.suggestion}
          </p>
        </div>
      </div>
    </div>
  );

  // Loading state (if needed)
  if (!filteredTasks) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading tasks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl shadow-xl overflow-hidden backdrop-blur-lg border border-white/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 px-8 py-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="mr-3 text-3xl">
              {filter === 'all' && '🌌'}
              {filter === 'pending' && '🔥'}
              {filter === 'completed' && '🎆'}
            </span>
            <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              {filter === 'all' && 'All Tasks'}
              {filter === 'pending' && 'Pending Tasks'}
              {filter === 'completed' && 'Completed Tasks'}
            </span>
          </h2>
          
          <div className="flex items-center space-x-4">
            <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center ${
              filter === 'completed' ? 'bg-green-100 text-green-800' : 
              filter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
            }`}>
              <span className="mr-2">📈</span>
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
            
            {filteredTasks.length > 0 && (
              <div className={`
                w-3 h-3 rounded-full shadow-lg animate-pulse
                ${filter === 'completed' ? 'bg-green-400 shadow-green-200' : 
                  filter === 'pending' ? 'bg-yellow-400 shadow-yellow-200' : 'bg-blue-400 shadow-blue-200'}
              `}></div>
            )}
          </div>
        </div>
      </div>

      {/* Task List Content */}
      <div className="p-6">
        {filteredTasks.length === 0 ? (
          <EmptyState config={emptyStateConfig} />
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}

        {/* Footer with task count summary */}
        {filteredTasks.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Showing {filteredTasks.length} of {taskStats.total} total tasks
              </span>
              
              {filter === 'all' && taskStats.completed > 0 && (
                <span className="text-green-600 font-medium">
                  {Math.round((taskStats.completed / taskStats.total) * 100)}% completed
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(TaskList);
