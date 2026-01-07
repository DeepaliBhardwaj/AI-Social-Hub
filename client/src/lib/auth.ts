// Simple cookie-based authentication utility
const AUTH_COOKIE_NAME = 'isAuthenticated';
const USER_DATA_KEY = 'socialgen_user';

export interface AuthUser {
  name: string;
  email: string;
  avatar: string;
  plan: 'Free' | 'Pro';
}

// Set authentication cookie
export function setAuthCookie(value: boolean): void {
  const expires = new Date();
  expires.setDate(expires.getDate() + 30); // 30 days
  document.cookie = `${AUTH_COOKIE_NAME}=${value}; expires=${expires.toUTCString()}; path=/`;
}

// Get authentication status from cookie
export function getAuthCookie(): boolean {
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith(`${AUTH_COOKIE_NAME}=`));
  return authCookie ? authCookie.split('=')[1] === 'true' : false;
}

// Remove authentication cookie
export function removeAuthCookie(): void {
  document.cookie = `${AUTH_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Store user data in localStorage
export function setUserData(user: AuthUser): void {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

// Get user data from localStorage
export function getUserData(): AuthUser | null {
  const data = localStorage.getItem(USER_DATA_KEY);
  return data ? JSON.parse(data) : null;
}

// Remove user data from localStorage
export function removeUserData(): void {
  localStorage.removeItem(USER_DATA_KEY);
}

// Login function - accepts any credentials
export function login(email: string, password: string): AuthUser {
  // Accept any credentials (demo purposes)
  const user: AuthUser = {
    name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
    email,
    avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=8b5cf6&color=fff`,
    plan: 'Pro',
  };
  
  setAuthCookie(true);
  setUserData(user);
  
  return user;
}

// Logout function
export function logout(): void {
  removeAuthCookie();
  removeUserData();
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getAuthCookie();
}

