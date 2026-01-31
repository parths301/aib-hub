
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { UserRole } from '../types';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    role: UserRole | null;
    creatorId: string | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [creatorId, setCreatorId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (userId: string) => {
        // Fetch role from profiles table
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        if (profile?.role) {
            if (profile.role === 'ADMIN') {
                setRole(UserRole.ADMIN);
            } else if (profile.role === 'CREATOR') {
                setRole(UserRole.CREATOR);
            } else {
                setRole(UserRole.VISITOR);
            }
        } else {
            setRole(UserRole.CREATOR); // Default fallback
        }

        // Fetch creatorId from creators table using linked_user_id
        const { data: creator } = await supabase
            .from('creators')
            .select('id')
            .eq('linked_user_id', userId)
            .single();

        if (creator?.id) {
            setCreatorId(creator.id);
        }
    };

    useEffect(() => {
        // Check active sessions and subscribe to auth changes
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserProfile(session.user.id);
            }
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserProfile(session.user.id);
            } else {
                setRole(null);
                setCreatorId(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setRole(null);
        setCreatorId(null);
    };

    return (
        <AuthContext.Provider value={{ session, user, role, creatorId, loading, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
