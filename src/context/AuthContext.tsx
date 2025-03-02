import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check current auth status
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      if (!email.trim() || !password.trim()) {
        return { error: 'Email and password are required' };
      }

      const { error: signInError, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          return { error: 'Invalid email or password' };
        }
        return { error: signInError.message };
      }

      if (data?.user) {
        // Update last login timestamp
        await supabase
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id);

        setIsAuthenticated(true);
        return { error: null };
      }

      return { error: 'Login failed. Please try again.' };
    } catch (err) {
      console.error('Login error:', err);
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      if (!name.trim() || !email.trim() || !password.trim()) {
        return { error: 'All fields are required' };
      }

      if (password.length < 6) {
        return { error: 'Password must be at least 6 characters long' };
      }

      // Try to sign up the user
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (signUpError) {
        // Handle specific error cases
        if (signUpError.message.includes('User already registered')) {
          return { error: 'An account with this email already exists' };
        }
        return { error: signUpError.message };
      }

      if (data?.user) {
        setIsAuthenticated(true);
        return { error: null };
      }

      return { error: 'Registration failed. Please try again.' };
    } catch (err) {
      console.error('Registration error:', err);
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}