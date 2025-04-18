// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

// Get the authentication token
export const getLocalStorage = (title: string): string | null => {
  return localStorage.getItem(title);
};

// Set the authentication token
export const setLocalStorage = (title: string, value: string): void => {
  localStorage.setItem(title, value);
};

// Remove the authentication token (for logout)
export const removeLocalStorage = (title: string): void => {
  localStorage.removeItem(title);
}; 

// Clear the local storage
export const clearLocalStorage = () => {
  localStorage.clear();
};
