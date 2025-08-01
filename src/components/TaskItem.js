import React, { useState, useCallback, useMemo } from 'react';
import { useTasks } from '../contexts/TaskContext';

/**
 * TaskItem component for rendering individual tasks
 * Optimized with React.memo to prevent unnecessary re-renders
 * Enhanced with priority, due date, and description support
 * @param {Object} props - Component props
 * @param {Object} props.task - Task object
 */
const TaskItem = ({ task }) => {
  const { toggleTask, deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Priority configuration with colors and icons
  const priorityConfig = {
    low: { icon: '🟢', label: 'Low', bgClass: 'bg-green-100 text-green-800 border-green-200', gradientClass: 'from-green-400 to-emerald-500' },
    medium: { icon: '🟡', label: 'Medium', bgClass: 'bg-yellow-100 text-yellow-800 border-yellow-200', gradientClass: 'from-yellow-400 to-orange-500' },
    high: { icon: '🔴', label: 'High', bgClass: 'bg-red-100 text-red-800 border-red-200', gradientClass: 'from-red-400 to-pink-500' }
  };

  // Memoized due date status
  const dueDateStatus = useMemo(() => {
    if (!task.dueDate) return null;
    
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'overdue', label: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`, class: 'due-overdue' };
    } else if (diffDays === 0) {
      return { status: 'today', label: 'Due today', class: 'due-today' };
    } else if (diffDays <= 3) {
      return { status: 'soon', label: `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`, class: 'due-upcoming' };
    } else {
      return { status: 'later', label: `Due ${dueDate.toLocaleDateString()}`, class: 'due-upcoming' };
    }
  }, [task.dueDate]);

  // Memoized toggle handler
  const handleToggle = useCallback(() => {
    toggleTask(task.id);
  }, [toggleTask, task.id]);

  // Memoized delete handler with confirmation
  const handleDelete = useCallback(async () => {
    if (window.confirm(`Are you sure you want to delete "${task.text}"?`)) {
      setIsDeleting(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      deleteTask(task.id);
    }
  }, [deleteTask, task.id, task.text]);

  // Format creation date
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  }, []);

  const currentPriority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <div className={`
      task-complete glass-dark rounded-2xl shadow-lg border border-white/10 p-6 mb-4
      hover:shadow-xl hover:border-white/20 transition-all duration-300
      ${task.completed ? 'completed opacity-80' : ''}
      ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
      ${task.priority === 'high' && !task.completed ? 'priority-high' : ''}
      ${task.priority === 'medium' && !task.completed ? 'priority-medium' : ''}
      ${task.priority === 'low' && !task.completed ? 'priority-low' : ''}
    `}>
      <div className="flex items-start space-x-4">
        {/* Priority Indicator & Checkbox */}
        <div className="flex flex-col items-center space-y-2">
          {/* Priority Badge */}
          <div className={`px-2 py-1 rounded-full text-xs font-bold border ${currentPriority.bgClass} flex items-center`}>
            <span className="mr-1">{currentPriority.icon}</span>
            {currentPriority.label}
          </div>
          
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            className={`
              w-6 h-6 rounded-full border-2 transition-all duration-300 focus-ring
              flex items-center justify-center transform hover:scale-110
              ${task.completed
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-transparent text-white shadow-lg'
                : `border-gray-300 hover:bg-gradient-to-r ${currentPriority.gradientClass} hover:border-transparent hover:text-white`
              }
            `}
            aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
          >
            {task.completed && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Task Content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-grow">
              {/* Task Title */}
              <h3 className={`
                text-lg font-semibold leading-relaxed break-words mb-2
                ${task.completed 
                  ? 'line-through text-gray-500' 
                  : 'text-gray-800'
                }
              `}>
                {task.text}
              </h3>
              
              {/* Task Description */}
              {task.description && (
                <p className={`
                  text-sm leading-relaxed break-words mb-3
                  ${task.completed 
                    ? 'line-through text-gray-400' 
                    : 'text-gray-600'
                  }
                `}>
                  📄 {task.description}
                </p>
              )}
              
              {/* Task Metadata */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {/* Creation Date */}
                <span className="flex items-center text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {formatDate(task.createdAt)}
                </span>
                
                {/* Due Date */}
                {dueDateStatus && (
                  <span className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold ${dueDateStatus.class}`}>
                    <span className="mr-1">📅</span>
                    {dueDateStatus.label}
                  </span>
                )}
                
                {/* Completion Status */}
                <span className={`
                  px-2 py-1 rounded-full text-xs font-semibold flex items-center
                  ${task.completed 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-purple-100 text-purple-800 border border-purple-200'
                  }
                `}>
                  <span className="mr-1">{task.completed ? '✅' : '⏳'}</span>
                  {task.completed ? 'Completed' : 'In Progress'}
                </span>
                
                {/* Show completion time if completed */}
                {task.completed && task.completedAt && (
                  <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <span className="mr-1">🎉</span>
                    Done {formatDate(task.completedAt)}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              {/* Expand/Collapse button if has description */}
              {task.description && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 rounded-lg text-gray-400 hover:text-purple-500 hover:bg-purple-50 transition-all duration-200 focus-ring"
                  aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                >
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
              
              {/* Edit button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 focus-ring"
                aria-label="Edit task"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5L6 5 6 19l7-7 7 7V5z" />
                </svg>
              </button>
              
              {/* Delete button */}
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`
                  p-2 rounded-lg transition-all duration-200 focus-ring
                  ${isDeleting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }
                `}
                aria-label="Delete task"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5l1.5 1.5a1 1 0 01-1.414 1.414L15 14.828V16a2 2 0 01-2 2H7a2 2 0 01-2-2v-1.172l-1.086 1.086A1 1 0 112.5 14.5L4 13V5zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export default React.memo(TaskItem, (prevProps, nextProps) => {
  const prevTask = prevProps.task;
  const nextTask = nextProps.task;
  
  return (
    prevTask.id === nextTask.id &&
    prevTask.text === nextTask.text &&
    prevTask.description === nextTask.description &&
    prevTask.priority === nextTask.priority &&
    prevTask.dueDate === nextTask.dueDate &&
    prevTask.completed === nextTask.completed &&
    prevTask.completedAt === nextTask.completedAt
  );
});
