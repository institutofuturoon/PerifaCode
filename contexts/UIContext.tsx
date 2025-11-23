import React, { createContext, useContext, useState } from 'react';
import { User, Course } from '../types';

interface UIContextType {
  toast: string | null;
  showToast: (message: string) => void;
  isProfileModalOpen: boolean;
  selectedProfile: User | null;
  openProfileModal: (member: User) => void;
  closeProfileModal: () => void;
  isInscriptionModalOpen: boolean;
  selectedCourseForInscription: Course | null;
  openInscriptionModal: (course: Course) => void;
  closeInscriptionModal: () => void;
}

const UIContext = createContext<UIContextType | null>(null);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);
  const [isInscriptionModalOpen, setIsInscriptionModalOpen] = useState(false);
  const [selectedCourseForInscription, setSelectedCourseForInscription] = useState<Course | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const openProfileModal = (member: User) => {
    setSelectedProfile(member);
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedProfile(null);
  };

  const openInscriptionModal = (course: Course) => {
    setSelectedCourseForInscription(course);
    setIsInscriptionModalOpen(true);
  };

  const closeInscriptionModal = () => {
    setIsInscriptionModalOpen(false);
    setSelectedCourseForInscription(null);
  };

  return (
    <UIContext.Provider
      value={{
        toast,
        showToast,
        isProfileModalOpen,
        selectedProfile,
        openProfileModal,
        closeProfileModal,
        isInscriptionModalOpen,
        selectedCourseForInscription,
        openInscriptionModal,
        closeInscriptionModal,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI deve estar dentro de UIProvider');
  return context;
};
