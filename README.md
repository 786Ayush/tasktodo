# 🎯 React Task Manager (Assignment Project)

A Task Manager application built using **React** for an assignment, showcasing core React concepts, modern design with TailwindCSS, and basic state management.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.1.6-blue)
![LocalStorage](https://img.shields.io/badge/Storage-LocalStorage-green)

---

## ✨ Features

### ✅ Basic Functionality
- Add new tasks with input validation
- Mark tasks as completed
- Delete tasks with confirmation
- Filter tasks: All, Completed, Pending
- Persist tasks using Local Storage

### ⚛️ React Concepts Used
- **Custom Hook**: `useLocalStorage` for saving tasks
- **Context API**: Global task management without prop drilling
- **Performance Enhancements**:
  - `React.memo` to avoid unnecessary re-renders
  - `useCallback` and `useMemo` for optimized functions and calculations
- **Higher-Order Component (HOC)**: `withLoader` for reusable loading UI
- **Form Validation**: Real-time feedback and error handling

### 💄 UI & Design
- Built using **TailwindCSS**
- Fully **responsive** (works on desktop, tablet, and mobile)
- Smooth animations and modern layout
- Accessible UI with keyboard support and ARIA labels

---

## 📁 Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── TaskForm.js     # Add new tasks with validation
│   ├── TaskItem.js     # Individual task component
│   ├── TaskList.js     # List of filtered tasks
│   └── Filters.js      # Filter buttons and controls
├── contexts/           # React Context providers
│   └── TaskContext.js  # Global task state management
├── hooks/              # Custom React hooks
│   └── useLocalStorage.js  # LocalStorage persistence hook
├── hoc/                # Higher Order Components
│   └── withLoader.js   # Loading state HOC
├── App.js              # Main application component
├── index.js            # React app entry point
└── index.css           # Global styles and TailwindCSS
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download** the project files
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm start
   ```
4. **Open your browser** to `http://localhost:3000`

### Available Scripts

```bash
npm start      # Start development server
npm build      # Build for production
```

## 🏗️ Architecture & Patterns

### Custom Hooks
- **`useLocalStorage`**: Manages browser storage with automatic JSON serialization

### Context API
- **`TaskContext`**: Provides global state for tasks without prop drilling
- **`TaskProvider`**: Wraps the app to provide task management functions

### Performance Optimizations
- **React.memo**: Prevents unnecessary component re-renders
- **useCallback**: Memoizes event handlers and functions
- **useMemo**: Memoizes expensive calculations and filtered data

### HOC (Higher Order Component)
- **`withLoader`**: Adds loading spinner to any component
- Customizable loading duration and spinner design

### Component Design
- **Separation of concerns**: Each component has a single responsibility
- **Reusable components**: Modular design for easy maintenance
- **Accessibility first**: ARIA labels and semantic HTML

## 📚 Component Documentation

### TaskForm
- Form validation for empty/whitespace-only inputs
- Character limit (200 characters)
- Real-time validation feedback
- Keyboard shortcuts (Enter to submit)

### TaskItem
- Checkbox for completion toggle
- Delete button with confirmation
- Timestamp display
- Visual completion states

### Filters
- Toggle between All, Pending, and Completed tasks
- Task count display
- Clear completed tasks functionality
- Active filter highlighting

### TaskList
- Displays filtered tasks
- Empty state messages
- Progress statistics
- Responsive layout

## 🎨 Styling & Theming

### TailwindCSS Configuration
- Custom animations and transitions
- Responsive breakpoints
- Focus and hover states
- Consistent spacing and colors

### Color Scheme
- **Primary**: Blue/Indigo gradient
- **Success**: Green for completed tasks
- **Warning**: Yellow/Orange for pending
- **Neutral**: Gray tones for UI elements

## 🔧 Customization

### Adding New Features
1. Create new components in `src/components/`
2. Add state management to `TaskContext.js`
3. Update the main `App.js` component

### Styling Changes
- Modify TailwindCSS classes in components
- Update `tailwind.config.js` for theme changes
- Add custom CSS in `src/index.css`

### Storage Options
- Replace `useLocalStorage` with sessionStorage
- Add database integration
- Implement cloud sync

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🙋‍♂️ Support

If you have questions or need help:
- Check the component documentation above
- Review the code comments (extensively documented)
- Open an issue for bugs or feature requests

## 🌟 Features Highlight

- **Beginner Friendly**: Well-commented code and clear structure
- **Production Ready**: Error handling, validation, and edge cases covered
- **Modern React**: Uses latest React patterns and best practices
- **Performance Optimized**: Minimal re-renders and efficient updates
- **Accessible**: WCAG compliant with proper ARIA attributes
- **Responsive**: Works perfectly on all device sizes

---

**Built with ❤️ using React, Context API, and TailwindCSS**
