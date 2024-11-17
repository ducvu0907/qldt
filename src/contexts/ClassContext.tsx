import React, { createContext, useState, ReactNode } from 'react';

interface ClassContextType {
  selectedClassId: string | null;
  setSelectedClassId: (newClassId: string | null) => void;
};

const ClassContext = createContext<ClassContextType>({
  selectedClassId: null,
  setSelectedClassId: () => {}
});

interface ClassProviderProps {
  children: ReactNode;
}

const ClassContextProvider: React.FC<ClassProviderProps> = ({ children }) => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  return (
    <ClassContext.Provider value={{selectedClassId, setSelectedClassId}}>
      {children}
    </ClassContext.Provider>
  );
};

export {ClassContext, ClassContextProvider};