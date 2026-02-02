import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
  token: string | null;
  
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Demo credentials
const DEMO_ADMIN = {
  email: 'admin@crowdsense.io',
  password: 'admin123',
  name: 'Admin User',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      
      login: async (email: string, password: string): Promise<boolean> => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
          const token = `jwt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          set({
            isAuthenticated: true,
            user: { email: DEMO_ADMIN.email, name: DEMO_ADMIN.name },
            token,
          });
          return true;
        }
        
        return false;
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        });
      },
    }),
    {
      name: 'crowdsense-auth',
    }
  )
);
