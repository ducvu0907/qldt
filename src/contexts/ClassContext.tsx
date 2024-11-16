import React, { createContext, useState, ReactNode } from 'react';
import { ClassItemData } from '../components/ClassListItem';

interface ClassContextType {
  selectedClass: ClassItemData | null;
  setSelectedClass: (newClass: ClassItemData | null) => void;
};

const ClassContext = createContext<ClassContextType>({
  selectedClass: null,
  setSelectedClass: () => {}
});

interface ClassProviderProps {
  children: ReactNode;
}

const ClassContextProvider: React.FC<ClassProviderProps> = ({ children }) => {
  const [selectedClass, setSelectedClass] = useState<ClassItemData | null>(null);

  return (
    <ClassContext.Provider value={{selectedClass, setSelectedClass}}>
      {children}
    </ClassContext.Provider>
  );
};

export {ClassContext, ClassContextProvider};