import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '@/types';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  selectedRole: UserRole;
  setUser: (user: User | null) => void;
  setSelectedRole: (role: UserRole) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      selectedRole: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSelectedRole: (role) => set({ selectedRole: role }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useAuth = () => {
  const { user, isAuthenticated, selectedRole, setUser, setSelectedRole, logout } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    selectedRole,
    setUser,
    setSelectedRole,
    logout,
  };
};