import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { api, tokenStore } from './api';

interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then((me) => setEmail(me.email))
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = async (emailInput: string, password: string) => {
    const res = await api.login(emailInput, password);
    tokenStore.set(res.token);
    const me = await api.me();
    setEmail(me.email);
  };

  const logout = () => {
    tokenStore.clear();
    setEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!email, email, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
