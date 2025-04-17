import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthError, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ error: AuthError | null }>;
  updateProfile: (data: { 
    fullName?: string; 
    avatarUrl?: string;
    gender?: string;
    mobileNumber?: string;
    city?: string;
    country?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clear any stale session data from localStorage
    const clearStaleSession = () => {
      try {
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('supabase.auth.refreshToken');
      } catch (error) {
        console.error('Error clearing stale session:', error);
      }
    };

    // Initialize the session
    const initializeSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!initialSession) {
          clearStaleSession();
          if (window.location.pathname !== '/login' && 
              window.location.pathname !== '/signup' && 
              window.location.pathname !== '/') {
            window.location.href = '/login';
          }
        } else {
          setSession(initialSession);
          setUser(initialSession.user);
        }
      } catch (error) {
        console.error('Error initializing session:', error);
        clearStaleSession();
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        clearStaleSession();
        setUser(null);
        setSession(null);
        window.location.href = '/login';
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } else if (event === 'USER_UPDATED') {
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      // Clear any local storage data
      localStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const deleteAccount = async () => {
    if (!user) return { error: new Error('No user logged in') };
    
    try {
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', user.id);
      
      if (deleteError) throw deleteError;
      
      await signOut();
      
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const updateProfile = async (data: { 
    fullName?: string; 
    avatarUrl?: string;
    gender?: string;
    mobileNumber?: string;
    city?: string;
    country?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    try {
      if (!user) throw new Error('No user logged in');

      // Handle password change if provided
      if (data.currentPassword && data.newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: data.newPassword,
        });

        if (passwordError) throw new Error(`Password update failed: ${passwordError.message}`);
      }

      // Update profile information
      const updates = {
        full_name: data.fullName,
        avatar_url: data.avatarUrl,
        gender: data.gender,
        mobile_number: data.mobileNumber,
        city: data.city,
        country: data.country,
        updated_at: new Date().toISOString(),
      };

      // First check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let error;

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('user_id', user.id);
        error = updateError;
      } else {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ ...updates, user_id: user.id }]);
        error = insertError;
      }

      if (error) throw error;

      // Update the user metadata in the session
      const updatedUserData = {
        full_name: data.fullName,
        avatar_url: data.avatarUrl,
        gender: data.gender,
        mobile_number: data.mobileNumber,
        city: data.city,
        country: data.country
      };
      
      const { data: authData, error: updateError } = await supabase.auth.updateUser({
        data: updatedUserData,
      });

      if (updateError) throw updateError;
      
      // Update local user state
      if (authData.user) {
        setUser(authData.user);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signUp,
        signIn,
        signOut,
        deleteAccount,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};