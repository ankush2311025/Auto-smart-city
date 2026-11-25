export const APP_CONFIG = {
  // Set to true (or VITE_USE_BACKEND=true) when connecting to the Express + Socket.IO server
  USE_BACKEND_SOCKET: import.meta.env.VITE_USE_BACKEND === 'true',
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000',
};
