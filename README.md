# open sense Dashboard

A comprehensive React-based admin dashboard application for open sense, featuring project management, contact form management, cost calculator request management, and responsive design with modern web technologies.

## Table of Contents
- [Overview](#overview)
- [Vision & Purpose](#vision--purpose)
- [Problem Solved](#problem-solved)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Folder Hierarchy](#folder-hierarchy)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [UI Components](#ui-components)
- [Reusable Components](#reusable-components)
- [Development](#development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Overview

open sense Dashboard is a modern React application built with Vite, featuring a comprehensive admin interface for managing projects, contact forms, cost calculator requests, and user interactions. The application provides an intuitive user experience for administrators to manage all aspects of the open sense platform.

## Vision & Purpose

open sense Dashboard serves as the central hub for managing the open sense ecosystem. It provides administrators with powerful tools to manage projects, client communications, service requests, and platform content. The dashboard enables efficient oversight and management of all platform activities through a unified interface.

## Problem Solved

The open sense Dashboard addresses several key challenges:
- **Centralized Management**: Unified interface for managing all platform components
- **Project Oversight**: Comprehensive project management with advanced filtering and search
- **Client Communication**: Streamlined contact form request management
- **Service Tracking**: Cost calculator request monitoring and management
- **Content Organization**: Categorized project and content management
- **User Experience**: Intuitive interface for efficient administration

## Features

### Core Features
- **Project Management**: Advanced project listing with filtering, search, and pagination
- **Contact Form Management**: Comprehensive contact request management with viewing and deletion capabilities
- **Cost Calculator Requests**: Service request tracking and management
- **Responsive Design**: Fully responsive layout that works on all device sizes
- **Modern UI**: Clean, intuitive user interface with Material-UI components
- **API Integration**: Seamless integration with open sense backend API
- **Performance Optimized**: Efficient rendering and data fetching
- **Direct Cloudinary Uploads**: Large image uploads (up to 25MB) directly from frontend to Cloudinary
- **Client-Side Compression**: Automatic image compression for optimal loading speeds

### Dashboard Features
- **Contact Form Requests**: View, search, filter, and manage contact form submissions
- **Cost Calculator Requests**: Monitor and manage service estimation requests
- **Project Management**: Create, update, and delete projects with image uploads
- **Category Management**: Organize projects into categories
- **User Management**: Manage user accounts and permissions
- **Analytics**: Dashboard with key metrics and insights

## Technology Stack

### Core Technologies
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Material-UI
- **Icons**: Material-UI Icons
- **Routing**: React Router DOM
- **State Management**: Redux Toolkit & RTK Query
- **HTTP Client**: Axios
- **UI Components**: Material-UI (MUI) components
- **Notifications**: React Toastify
- **Development**: ESLint, Prettier

### Libraries & Dependencies
- **@reduxjs/toolkit**: State management solution for React
- **@mui/material**: Material-UI components
- **@mui/icons-material**: Material-UI icons
- **@mui/x-data-grid**: Advanced data grid component
- **react-router-dom**: Declarative routing for React
- **react-toastify**: Toast notifications
- **@emotion/react**: CSS-in-JS library
- **@emotion/styled**: CSS-in-JS library
- **axios**: Promise-based HTTP client
- **react-redux**: React bindings for Redux
- **vite**: Next-generation frontend tooling

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd open sense-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Update environment variables**
```env
VITE_API_BASE_URL=https://open-sense-backend.vercel.app/api
VITE_BASE_URL=https://open-sense-backend.vercel.app
```

5. **For image uploads, add Cloudinary configuration** (optional):
```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

5. **Start development server**
```bash
npm run dev
```

## Project Structure

```
open sense-dashboard/
├── public/                 # Static assets
├── src/
│   ├── _core/             # Core application setup
│   │   └── Slices/        # Redux slices and API
│   │       └── apiSlice.js # Main API slice with RTK Query
│   │       └── authSlice.js # Authentication slice
│   ├── components/        # Reusable UI components
│   │   ├── ContactViewModal/ # Contact request view modal
│   │   ├── CostCalculatorViewModal/ # Cost calculator view modal
│   │   ├── Pagination/    # Pagination component
│   │   └── ...           # Other reusable components
│   ├── constants/         # Application constants
│   ├── container/         # Layout containers
│   ├── Data/              # Static data and configurations
│   ├── Helper/            # Helper functions
│   ├── hooks/             # Custom React hooks
│   ├── Pages/             # Page components
│   │   ├── AuthPanel/     # Authentication pages
│   │   ├── Categories/    # Category management
│   │   ├── ContactForm/   # Contact form management
│   │   ├── CostCalculator/ # Cost calculator management
│   │   ├── Dashboard/     # Dashboard layout
│   │   ├── DashboardHome/ # Dashboard home page
│   │   ├── NotFound/      # 404 page
│   │   ├── Projects/      # Project management
│   │   └── VerifyOtp/     # OTP verification
│   ├── utils/             # Utility functions
│   │   └── ApiBaseUrl.js  # API base URL configuration
│   ├── App.jsx            # Main application component
│   ├── App.css            # Global styles
│   ├── index.css          # CSS imports and base styles
│   ├── main.jsx           # Application entry point
│   └── routes.jsx         # Route configuration
├── .env                   # Environment variables
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore file
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML template
├── package.json          # Project dependencies
├── package-lock.json     # Dependency lock file
├── README.md             # Dashboard documentation
└── vite.config.js        # Vite configuration
```

## Folder Hierarchy

### Core Structure
- **`src/_core/`**: Contains core application setup including Redux store and API slices
  - **`Slices/`**: Redux slices for state management and API integration
    - `apiSlice.js`: Main API slice using RTK Query for data fetching and caching
    - `authSlice.js`: Authentication state management

- **`src/components/`**: Reusable UI components used throughout the application
  - **`ContactViewModal/`**: Modal component for viewing contact form details
  - **`CostCalculatorViewModal/`**: Modal component for viewing cost calculator details
  - **`Pagination/`**: Custom pagination component
  - Other reusable UI components

- **`src/Pages/`**: Page-level components organized by feature
  - **`AuthPanel/`**: Authentication-related pages (login, signup)
  - **`Categories/`**: Category management pages
  - **`ContactForm/`**: Contact form management pages
  - **`CostCalculator/`**: Cost calculator request management pages
  - **`Dashboard/`**: Dashboard layout and navigation
  - **`DashboardHome/`**: Dashboard home page with analytics
  - **`Projects/`**: Project management pages

- **`src/utils/`**: Utility functions and configurations
  - `ApiBaseUrl.js`: API base URL configuration

### Key Files
- **`App.jsx`**: Main application component that sets up routing and global context
- **`routes.jsx`**: Centralized route configuration using React Router
- **`src/_core/Slices/apiSlice.js`**: Main API slice with RTK Query endpoints
- **`src/Pages/ContactForm/ContactFormList.jsx`**: Contact form management page
- **`src/Pages/CostCalculator/CostCalculatorList.jsx`**: Cost calculator management page

## API Integration

### RTK Query Implementation
The dashboard uses Redux Toolkit Query (RTK Query) for API integration, providing:
- Automatic caching and data fetching
- Request deduplication
- Automatic refetching on focus/refetch
- Built-in loading/error states
- Optimistic updates

### API Endpoints
- **Contact Forms**: `useGetContactRequestsQuery`, `useDeleteContactRequestMutation`
- **Cost Calculator**: `useGetCostCalculatorRequestsQuery`, `useDeleteCostCalculatorRequestMutation`
- **Projects**: `useGetProjectsQuery`, `useCreateProjectMutation`, `useUpdateProjectMutation`, `useDeleteProjectMutation`
- **Categories**: `useGetCategoriesQuery`, `useCreateCategoryMutation`, `useUpdateCategoryMutation`, `useDeleteCategoryMutation`

### Base URL Configuration
```javascript
// src/utils/ApiBaseUrl.js
export const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://open sense-backend.vercel.app';
```

### Authentication Integration
- JWT tokens are automatically included in API requests
- Token is retrieved from Redux auth state
- Automatic logout on 401 responses

## State Management

### Redux Toolkit
- **Store Configuration**: Centralized state management using Redux Toolkit
- **API Integration**: RTK Query for server state management
- **Authentication**: Auth slice for user session management
- **Caching**: Automatic caching with configurable invalidation

### RTK Query Features
- **Automatic Caching**: Responses are cached automatically
- **Cache Invalidation**: Tag-based cache invalidation system
- **Loading States**: Built-in loading and error states
- **Refetching**: Automatic refetching on focus and interval

## UI Components

### Material-UI Integration
- **Data Grid**: MUI DataGrid for advanced table functionality with pagination
- **Components**: Various MUI components for consistent UI
- **Icons**: Material-UI icons for visual elements
- **Themes**: Consistent theming across the application

### Custom Components
- **ContactViewModal**: Modal for viewing contact form details
- **CostCalculatorViewModal**: Modal for viewing cost calculator request details
- **Pagination**: Custom pagination component
- **Reusable UI Elements**: Buttons, forms, cards, etc.

## Reusable Components

### Shared Components
- **Modal Components**: Reusable modal dialogs for viewing details
- **Form Components**: Consistent form elements across the application
- **Table Components**: Standardized table layouts with pagination
- **Utility Components**: Loading spinners, error displays, etc.

### Component Architecture
- **Modular Design**: Components are designed to be reusable and composable
- **Consistent Styling**: All components follow the same design system
- **Accessibility**: Components are built with accessibility in mind
- **Responsive Design**: Components adapt to different screen sizes

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Development Tools
- Vite for fast development
- Hot Module Replacement (HMR)
- ESLint for code quality
- Prettier for code formatting
- React Developer Tools browser extension

### Environment Variables
- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_BASE_URL` - Application base URL

## Deployment

### Build Process
```bash
npm run build
```

### Deployment Options
- Vercel (recommended)
- Netlify
- GitHub Pages
- Custom hosting providers

### Production Environment
- Minified and optimized assets
- Gzipped responses
- Optimized images
- Caching strategies

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env` file exists and has correct format
   - Restart development server after changing environment variables

2. **API Requests Failing**
   - Verify backend server is running
   - Check `VITE_API_BASE_URL` in environment variables
   - Ensure CORS is properly configured on the backend

3. **Authentication Issues**
   - Verify JWT token is properly stored in Redux state
   - Check if token is being sent with API requests
   - Ensure token hasn't expired

4. **Performance Issues**
   - Use debounced search for large datasets
   - Implement proper pagination for large lists
   - Optimize images and assets

### Development Tips

- Use React Developer Tools browser extension
- Enable React Strict Mode in development
- Monitor network requests for API calls
- Use console logging for debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes following coding standards
4. Submit a pull request

## License

[Specify your license here]

## Support

For support, please contact [contact information].