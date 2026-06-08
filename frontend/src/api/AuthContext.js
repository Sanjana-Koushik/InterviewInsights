import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isNewUser, setIsNewUser] = useState(false);
    //const [authMode, setAuthMode] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUser(session.user);

                // Check if user exists in our users table
                const { data } = await supabase
                    .from('users')
                    .select('id')
                    .eq('id', session.user.id)
                    .single();

                // Get the saved auth mode from localStorage
                const savedMode = localStorage.getItem('authMode');

                if (savedMode === 'signup') {
                    // Always go to register for sign up
                    setIsNewUser(true);
                } else {
                    // For sign in — check if they exist
                    if (!data) {
                        // Account not found — they need to sign up first
                        setIsNewUser(true);
                    } else {
                        setIsNewUser(false);
                    }
                }
                localStorage.removeItem('authMode');
            } else {
                setUser(null);
                setIsNewUser(false);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        localStorage.setItem('authMode', 'signin');
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://interview-insights-tau.vercel.app',
                queryParams: {
                    prompt: 'select_account'
                }
            }
        });
    };

    const signUpWithGoogle = async () => {
        localStorage.setItem('authMode', 'signup');
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://interview-insights-tau.vercel.app',
                queryParams: {
                    prompt: 'select_account'
                }
            }
        });
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setIsNewUser(false);
        //setAuthMode(null);
    };

    const markUserAsRegistered = () => {
        setIsNewUser(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, isNewUser, signInWithGoogle, signUpWithGoogle, signOut, markUserAsRegistered }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}