import React, { createContext, useContext, useReducer, useMemo, useCallback, type ReactNode } from 'react';

/**
 * App state interface
 */
interface AppState {
  loading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
}

/**
 * App actions
 */
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_THEME' };

/**
 * App context interface
 */
interface AppContextType {
  state: AppState;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * App reducer function
 */
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'TOGGLE_THEME':
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      // Apply theme to document
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // Save to localStorage
      localStorage.setItem('theme', newTheme);
      return { ...state, theme: newTheme };
    default:
      return state;
  }
};

/**
 * Initial state
 */
const initialState: AppState = {
  loading: false,
  error: null,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
};

/**
 * App Provider Component
 */
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Apply initial theme
  React.useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Memoized action creators
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' });
  }, []);

  // Memoize context value
  const value = useMemo(
    () => ({
      state,
      setLoading,
      setError,
      toggleTheme,
    }),
    [state, setLoading, setError, toggleTheme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Custom hook to use App context
 */
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

