import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Community, Builder } from '../types';
import { getCommunitiesFromStorage, getBuildersFromStorage, getComparisonFromLocalStorage, saveComparisonToLocalStorage, getFavoritesFromLocalStorage, saveFavoritesToLocalStorage } from '../utils/storage';

interface AppContextType {
  communities: Community[];
  builders: Builder[];
  comparison: string[];
  favorites: string[];
  addToComparison: (id: string) => boolean;
  removeFromComparison: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  isInComparison: (id: string) => boolean;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [comparison, setComparison] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const refreshData = useCallback(() => {
    setCommunities(getCommunitiesFromStorage());
    setBuilders(getBuildersFromStorage());
  }, []);

  useEffect(() => {
    refreshData();
    setComparison(getComparisonFromLocalStorage());
    setFavorites(getFavoritesFromLocalStorage());
  }, [refreshData]);

  const addToComparison = (id: string): boolean => {
    if (comparison.includes(id)) return true;
    if (comparison.length >= 4) return false;
    const next = [...comparison, id];
    setComparison(next);
    saveComparisonToLocalStorage(next);
    return true;
  };

  const removeFromComparison = (id: string) => {
    const next = comparison.filter(c => c !== id);
    setComparison(next);
    saveComparisonToLocalStorage(next);
  };

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(next);
    saveFavoritesToLocalStorage(next);
  };

  return (
    <AppContext.Provider value={{
      communities, builders, comparison, favorites,
      addToComparison, removeFromComparison, toggleFavorite,
      isFavorite: (id) => favorites.includes(id),
      isInComparison: (id) => comparison.includes(id),
      refreshData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
