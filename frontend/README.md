# Coffee Tracker Frontend

React + TypeScript frontend for Coffee Tracker application.

## Architecture

This frontend follows proper **separation of concerns** with distinct layers:

### 📁 Layer Structure

```
src/
├── types/           # Type Definitions (Data Models)
├── services/        # Data Access Layer (API calls)
├── hooks/           # Business Logic Layer (State management)
├── components/      # Presentation Layer (UI components)
├── pages/           # Page Layer (Orchestrators)
└── utils/           # Utility functions
```

### 🏗️ Layer Responsibilities

**1. Types Layer** (`types/`)
- Define TypeScript interfaces
- Data models and constants

**2. Services Layer** (`services/`)
- HTTP communication with backend
- Axios configuration
- API endpoints

**3. Hooks Layer** (`hooks/`)
- Business logic
- State management
- Data transformation

**4. Components Layer** (`components/`)
- Pure presentational components
- UI rendering only
- No business logic

**5. Pages Layer** (`pages/`)
- Orchestrate components
- Use hooks for logic
- Layout and composition

## 🚀 Running Locally

### Prerequisites
- Node.js 16+ and npm

### Install Dependencies
```bash
cd frontend
npm install
```

### Start Development Server
```bash
npm start
```

Access at: http://localhost:3000

### Build for Production
```bash
npm run build
```

## 🔌 API Configuration

Set backend URL in environment variable:

```bash
# .env.local
REACT_APP_API_URL=http://localhost:8080/api/v1
```

## 📦 Key Dependencies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **Recharts** - Charts library
- **date-fns** - Date formatting

## 🎨 Features

- ✅ Log coffee consumption
- ✅ View consumption history
- ✅ Real-time statistics
- ✅ Interactive charts
- ✅ Responsive design
- ✅ Type-safe with TypeScript
- ✅ Clean architecture with separation of concerns
