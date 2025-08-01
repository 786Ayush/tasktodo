import React, { useState, useCallback } from 'react';
import { TaskProvider } from './contexts/TaskContext';
import withLoader from './hoc/withLoader';
import TaskForm from './components/TaskForm';
import Filters from './components/Filters';
import TaskList from './components/TaskList';

/**
 * Main App component - Task Manager Application
 * Features:
 * - Add, edit, delete tasks
 * - Filter tasks by status
 * - Local storage persistence
 * - Performance optimizations
 * - Responsive design
 */
const TaskManager = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Memoized filter change handler
  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="glass rounded-3xl shadow-2xl p-12 mb-8 backdrop-blur-lg border border-white/20">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 flex items-center justify-center">
              <span className="mr-4 text-6xl md:text-8xl animate-bounce">✨</span>
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              🚀 Transform your productivity with our intelligent task management system.
              Create, organize, and conquer your goals with style!
            </p>
            <div className="mt-6 flex justify-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center">
                <span className="mr-2">🎨</span>
                Beautiful Design
              </span>
              <span className="flex items-center">
                <span className="mr-2">⚡</span>
                Lightning Fast
              </span>
              <span className="flex items-center">
                <span className="mr-2">💾</span>
                Auto-Save
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Task Form */}
          <section aria-label="Add new task">
            <TaskForm />
          </section>

          {/* Filters */}
          <section aria-label="Filter tasks">
            <Filters 
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
          </section>

          {/* Task List */}
          <section aria-label="Task list">
            <TaskList filter={activeFilter} />
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="glass rounded-2xl shadow-lg p-8 backdrop-blur-lg border border-white/20">
            <p className="text-gray-700 text-lg mb-4 flex items-center justify-center">
              <span className="mr-2">💫</span>
              Built with ❤️ using React, Context API, and TailwindCSS
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="flex items-center bg-white/50 px-3 py-1 rounded-full">
                <span className="mr-2">🎣</span>
                Custom Hooks
              </span>
              <span className="flex items-center bg-white/50 px-3 py-1 rounded-full">
                <span className="mr-2">⚡</span>
                Performance Optimized
              </span>
              <span className="flex items-center bg-white/50 px-3 py-1 rounded-full">
                <span className="mr-2">💾</span>
                Local Storage
              </span>
              <span className="flex items-center bg-white/50 px-3 py-1 rounded-full">
                <span className="mr-2">🎭</span>
                HOC Pattern
              </span>
            </div>
            <div className="mt-6 text-xs text-gray-500">
              🌍 Open Source • 📱 Responsive • ♾️ Accessible • 🚀 Modern
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// Wrap the TaskManager with the loader HOC (simulates initial loading)
const TaskManagerWithLoader = withLoader(TaskManager, 1500);

/**
 * Root App component with TaskProvider
 */
const App = () => {
  return (
    <TaskProvider>
      <TaskManagerWithLoader />
    </TaskProvider>
  );
};

export default App;
