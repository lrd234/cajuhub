import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Occurrence {
  id: string;
  type: string;
  location: string;
  description: string;
  photo?: string;
  status: 'pending' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

interface OccurrenceContextType {
  occurrences: Occurrence[];
  addOccurrence: (occurrence: Omit<Occurrence, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateOccurrenceStatus: (id: string, status: 'pending' | 'resolved') => void;
  deleteOccurrence: (id: string) => void;
  getStatistics: () => {
    total: number;
    pending: number;
    resolved: number;
  };
}

const OccurrenceContext = createContext<OccurrenceContextType | undefined>(undefined);

export const useOccurrences = () => {
  const context = useContext(OccurrenceContext);
  if (!context) {
    throw new Error('useOccurrences must be used within an OccurrenceProvider');
  }
  return context;
};

export const OccurrenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedOccurrences = localStorage.getItem('occurrences');
    if (savedOccurrences) {
      const parsed = JSON.parse(savedOccurrences);
      // Converter strings de data para objetos Date
      const occurrencesWithDates = parsed.map((occ: any) => ({
        ...occ,
        createdAt: new Date(occ.createdAt),
        updatedAt: new Date(occ.updatedAt),
      }));
      setOccurrences(occurrencesWithDates);
    }
  }, []);

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('occurrences', JSON.stringify(occurrences));
  }, [occurrences]);

  const addOccurrence = (occurrenceData: Omit<Occurrence, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newOccurrence: Occurrence = {
      ...occurrenceData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setOccurrences(prev => [newOccurrence, ...prev]);
  };

  const updateOccurrenceStatus = (id: string, status: 'pending' | 'resolved') => {
    setOccurrences(prev =>
      prev.map(occ =>
        occ.id === id
          ? { ...occ, status, updatedAt: new Date() }
          : occ
      )
    );
  };

  const deleteOccurrence = (id: string) => {
    setOccurrences(prev => prev.filter(occ => occ.id !== id));
  };

  const getStatistics = () => {
    const total = occurrences.length;
    const pending = occurrences.filter(occ => occ.status === 'pending').length;
    const resolved = occurrences.filter(occ => occ.status === 'resolved').length;
    return { total, pending, resolved };
  };

  return (
    <OccurrenceContext.Provider
      value={{
        occurrences,
        addOccurrence,
        updateOccurrenceStatus,
        deleteOccurrence,
        getStatistics,
      }}
    >
      {children}
    </OccurrenceContext.Provider>
  );
};