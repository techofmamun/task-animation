# Task Animation - Multi-Step Form UI

A production-ready React/TypeScript application featuring an animated multi-step form with draggable step navigation, context menus, and smooth animations.

## Features

- **Multi-Step Form Navigation**: Bottom-aligned horizontal step tabs with active state indicators
- **Drag & Drop Reordering**: Reorder form steps with smooth animations using dnd-kit
- **Context Menus**: Right-click or click active step to access context menu with actions
- **Dynamic Page Management**: Add/delete pages with slide-in/slide-out animations
- **Keyboard Accessibility**: Full keyboard navigation support with focus indicators
- **Responsive Design**: Optimized for various screen sizes with smooth scrolling
- **Error Boundaries**: Production-ready error handling and graceful fallbacks

## Technology Stack

- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5.8.3** - Full type safety with strict configuration
- **Vite 7.0.0** - Fast build tool and development server
- **@dnd-kit** - Modern drag and drop library for React
- **ESLint** - Code linting with TypeScript support
- **CSS3** - Modern CSS with custom properties and animations

## Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
```

## Production Considerations

### Performance Optimizations
- React.memo for component memoization
- useCallback for event handler optimization
- CSS animations instead of JavaScript for better performance
- Tree-shaking enabled for smaller bundle size

### Error Handling
- Error boundaries to catch and handle React errors gracefully
- TypeScript strict mode for compile-time error prevention
- ESLint rules for code quality and consistency

### Accessibility
- WCAG 2.1 compliant focus management
- Keyboard navigation support
- Screen reader friendly ARIA attributes
- High contrast focus indicators
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
