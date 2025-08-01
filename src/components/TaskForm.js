import React, { useState, useCallback } from 'react';
import { useTasks } from '../contexts/TaskContext';

/**
 * TaskForm component for adding new tasks with validation
 * Features form validation and error handling
 * Supports: title, description, priority, and due date
 */
const TaskForm = () => {
  const { addTask } = useTasks();
  const [formData, setFormData] = useState({
    text: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Priority options with colors and icons
  const priorityOptions = [
    { value: 'low', label: 'Low Priority', icon: '🟢', color: 'from-green-400 to-emerald-500' },
    { value: 'medium', label: 'Medium Priority', icon: '🟡', color: 'from-yellow-400 to-orange-500' },
    { value: 'high', label: 'High Priority', icon: '🔴', color: 'from-red-400 to-pink-500' }
  ];

  // Validation function
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.text.trim()) {
      newErrors.text = 'Task title is required';
    } else if (formData.text.length > 100) {
      newErrors.text = 'Title cannot exceed 100 characters';
    }
    
    if (formData.description && formData.description.length > 300) {
      newErrors.description = 'Description cannot exceed 300 characters';
    }
    
    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form input changes
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      addTask({
        text: formData.text.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        dueDate: formData.dueDate || null
      });
      
      // Reset form
      setFormData({
        text: '',
        description: '',
        priority: 'medium',
        dueDate: ''
      });
      setIsExpanded(false);
      
    } catch (err) {
      setErrors({ submit: 'Failed to add task. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, addTask, validateForm]);

  // Clear form
  const handleClear = useCallback(() => {
    setFormData({
      text: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
    setErrors({});
    setIsExpanded(false);
  }, []);

  // Get today's date for min date input
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="glass rounded-2xl shadow-xl p-8 mb-8 backdrop-blur-lg border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
          <span className="mr-3 text-3xl">✨</span>
          Create New Task
        </h2>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-110 focus-ring"
          aria-label={isExpanded ? 'Collapse form' : 'Expand form'}
        >
          <svg className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Title */}
        <div className="space-y-2">
          <label htmlFor="taskTitle" className="block text-sm font-semibold text-gray-700 flex items-center">
            <span className="mr-2">📝</span>
            Task Title *
          </label>
          <div className="relative">
            <input
              id="taskTitle"
              type="text"
              value={formData.text}
              onChange={(e) => handleInputChange('text', e.target.value)}
              placeholder="What needs to be done?"
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus-ring ${
                errors.text
                  ? 'border-red-300 bg-red-50 focus:border-red-500'
                  : 'border-purple-200 focus:border-purple-500 hover:border-purple-300 bg-white/50'
              }`}
              maxLength={100}
              disabled={isSubmitting}
            />
            <div className="absolute right-3 top-3 text-xs text-gray-400">
              {formData.text.length}/100
            </div>
          </div>
          {errors.text && (
            <p className="text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.text}
            </p>
          )}
        </div>

        {/* Expandable Advanced Options */}
        <div className={`space-y-6 transition-all duration-300 overflow-hidden ${
          isExpanded ? ' opacity-100' : 'max-h-0 opacity-0'
        }`}>
          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="taskDescription" className="block text-sm font-semibold text-gray-700 flex items-center">
              <span className="mr-2">📄</span>
              Description
            </label>
            <textarea
              id="taskDescription"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Add more details about this task..."
              rows={3}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus-ring resize-none ${
                errors.description
                  ? 'border-red-300 bg-red-50 focus:border-red-500'
                  : 'border-purple-200 focus:border-purple-500 hover:border-purple-300 bg-white/50'
              }`}
              maxLength={300}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Optional details about your task</span>
              <span className="text-xs text-gray-400">{formData.description.length}/300</span>
            </div>
            {errors.description && (
              <p className="text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.description}
              </p>
            )}
          </div>

          <div className="flex  gap-6">
            {/* Priority */}
            <div className="space-y-2 p-4 w-1/2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center">
                <span className="mr-2">⭐</span>
                Priority Level
              </label>
              <div className="flex flex-col gap-4">
                {priorityOptions.map((option) => (
                  <label key={option.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value={option.value}
                      checked={formData.priority === option.value}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="sr-only"
                      disabled={isSubmitting}
                    />
                    <div className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center ${
                      formData.priority === option.value
                        ? `bg-gradient-to-r ${option.color} text-white border-transparent shadow-lg transform scale-105`
                        : 'border-gray-200 hover:border-purple-300 bg-white/50 hover:bg-white/70'
                    }`}>
                      <span className="mr-3 text-lg">{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2 w-1/2">
              <label htmlFor="taskDueDate" className="block text-sm font-semibold text-gray-700 flex items-center">
                <span className="mr-2">📅</span>
                Due Date
              </label>
              <input
                id="taskDueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                min={getTodayDate()}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus-ring ${
                  errors.dueDate
                    ? 'border-red-300 bg-red-50 focus:border-red-500'
                    : 'border-purple-200 focus:border-purple-500 hover:border-purple-300 bg-white/50'
                }`}
                disabled={isSubmitting}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.dueDate}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-center">
            <span className="mr-2">❌</span>
            {errors.submit}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium flex items-center"
            disabled={isSubmitting}
          >
            <span className="mr-2">🗑️</span>
            Clear Form
          </button>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 font-medium flex items-center"
              disabled={isSubmitting}
            >
              <span className="mr-2">{isExpanded ? '📝' : '⚙️'}</span>
              {isExpanded ? 'Basic' : 'Advanced'}
            </button>
            
            <button
              type="submit"
              disabled={!formData.text.trim() || isSubmitting || Object.keys(errors).length > 0}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 focus-ring flex items-center ${
                !formData.text.trim() || isSubmitting || Object.keys(errors).length > 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span>
                  Create Task
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;

