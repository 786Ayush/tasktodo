import React, { createContext, useContext, useCallback, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Create the context
const TaskContext = createContext();

/**
 * Custom hook to use the Task context
 * @returns {Object} Task context value
 */
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

/**
 * Task Provider component that wraps the app and provides task management functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const TaskProvider = ({ children }) => {
  // Use our custom hook to persist tasks in localStorage
  const [tasks, setTasks] = useLocalStorage('tasks', []);

  /**
   * Add a new task
   * @param {Object} taskData - Task data object
   * @param {string} taskData.text - Task title
   * @param {string} taskData.description - Task description
   * @param {string} taskData.priority - Task priority (low, medium, high)
   * @param {string} taskData.dueDate - Task due date (ISO string)
   */
  const addTask = useCallback((taskData) => {
    const newTask = {
      id: Date.now() + Math.random(), // Simple ID generation
      text: taskData.text.trim(),
      description: taskData.description?.trim() || '',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, [setTasks]);

  /**
   * Toggle task completion status
   * @param {number} id - Task ID
   */
  const toggleTask = useCallback((id) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { 
          ...task, 
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : null
        } : task
      )
    );
  }, [setTasks]);

  /**
   * Update an existing task
   * @param {number} id - Task ID
   * @param {Object} updates - Updates to apply
   */
  const updateTask = useCallback((id, updates) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  }, [setTasks]);

  /**
   * Delete a task
   * @param {number} id - Task ID
   */
  const deleteTask = useCallback((id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, [setTasks]);

  /**
   * Clear all completed tasks
   */
  const clearCompleted = useCallback(() => {
    setTasks(prevTasks => prevTasks.filter(task => !task.completed));
  }, [setTasks]);

  /**
   * Get filtered tasks based on filter type
   * @param {string} filter - Filter type ('all', 'pending', 'completed')
   * @returns {Array} Filtered tasks
   */
  const getFilteredTasks = useCallback((filter) => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed);
      default:
        return tasks;
    }
  }, [tasks]);

  // Memoized task statistics
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    return { total, completed, pending };
  }, [tasks]);

  // Context value
  const value = useMemo(() => ({
    tasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    getFilteredTasks,
    taskStats,
  }), [tasks, addTask, updateTask, toggleTask, deleteTask, clearCompleted, getFilteredTasks, taskStats]);

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
