import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabaseClient';

interface CityContextType {
    selectedCity: string;
    setSelectedCity: (city: string) => void;
    cities: string[];
    loadingCities: boolean;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [cities, setCities] = useState<string[]>([]);
    const [loadingCities, setLoadingCities] = useState(true);

    useEffect(() => {
        const fetchCities = async () => {
            setLoadingCities(true);

            // Fetch unique cities from creators
            const { data: creatorsData } = await supabase
                .from('creators')
                .select('city')
                .eq('status', 'APPROVED');

            // Fetch unique cities from jobs
            const { data: jobsData } = await supabase
                .from('jobs')
                .select('city');

            const allCities = new Set<string>();

            creatorsData?.forEach(c => {
                if (c.city) allCities.add(c.city);
            });

            jobsData?.forEach(j => {
                if (j.city) allCities.add(j.city);
            });

            setCities(Array.from(allCities).sort());
            setLoadingCities(false);
        };

        fetchCities();
    }, []);

    return (
        <CityContext.Provider value={{ selectedCity, setSelectedCity, cities, loadingCities }}>
            {children}
        </CityContext.Provider>
    );
};

export const useCity = (): CityContextType => {
    const context = useContext(CityContext);
    if (context === undefined) {
        throw new Error('useCity must be used within a CityProvider');
    }
    return context;
};
