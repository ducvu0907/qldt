import React, { createContext, useState, ReactNode } from 'react';
import { ClassData } from '../components/Class';

interface ClassContextType {
  selectedClass: ClassData | null;
  setSelectedClass: (newClass: ClassData | null) => void;
};

const ClassContext = createContext<ClassContextType>({
  selectedClass: null,
  setSelectedClass: () => {}
});

interface ClassProviderProps {
  children: ReactNode;
}

const ClassContextProvider: React.FC<ClassProviderProps> = ({ children }) => {
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);

  return (
    <ClassContext.Provider value={{selectedClass, setSelectedClass}}>
      {children}
    </ClassContext.Provider>
  );
};

export {ClassContext, ClassContextProvider};