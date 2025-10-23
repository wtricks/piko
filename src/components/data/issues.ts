import type { Issue } from '@/stores/issue'

export const dummyIssues: Issue[] = [
  {
    type: 'error',
    message: 'Failed to load resource: the server responded with a status of 404 (Not Found)',
    timestamp: '2024-10-01 10:15:30',
  },
  {
    type: 'warning',
    message: 'Deprecated API usage detected in component XYZ',
    timestamp: '2024-10-01 11:00:45',
  },
  {
    type: 'error',
    message: "Uncaught TypeError: Cannot read property 'foo' of undefined",
    timestamp: '2024-10-01 12:30:10',
  },
  {
    type: 'warning',
    message: 'Low memory warning: Consider optimizing your application',
    timestamp: '2024-10-01 13:45:20',
  },
]
