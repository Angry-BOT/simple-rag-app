/**
 * Centralized query keys for React Query
 * Ensures consistency across the application
 */
export const queryKeys = {
  files: {
    all: ['files'] as const,
    detail: (id: string) => ['files', id] as const,
  },
  chat: {
    health: ['chat', 'health'] as const,
  },
} as const;

