"use client"
import { useContext, createContext, useState, useEffect, ReactNode } from "react";
import { logIn } from "../actions/logIn";
import { useRouter } from "next/navigation";
import { signUp } from "../actions/signUp";

interface AuthContextProps {
  user: boolean;
  setUser : React.Dispatch<React.SetStateAction<boolean>>;
  login: (email: string, password: string) => Promise<number>;
  logout: () => void;
  signup: (email: string, password: string, userName: string) => Promise<number>;
  setCartItemNumber: React.Dispatch<React.SetStateAction<number>>;
  cartItemNumber: number;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}: AuthContextProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<boolean>(false);
  const [cartItemNumber, setCartItemNumber] = useState(0);

  // sign up
  const signup = async (email: string,password: string,userName: string): Promise<number> => {
    const {result,status} = await signUp(email, password, userName);
    if (status === 200) {
      localStorage.setItem("accessToken", result.accessToken);
      setUser(true);
      router.push("/");
      return status;
    }
    else {
      setUser(false)
      return status
    }
  };

  const login = async (email: string,password: string): Promise<number> => {

    const { result,status } = await logIn(email, password);
    if (status === 200) {
      localStorage.setItem("accessToken", result.accessToken);
      setUser(true);
      router.push("/");
      return status
    } else {
      setUser(false)
      return status;
    }
  };

  const logout = (): void => {
    localStorage.removeItem("accessToken");
    setUser(false);
    router.push('/authentication')
  };

  useEffect(() => {
    const isUser = localStorage.getItem("accessToken");
    if(!isUser) {
      router.push("/authentication")
    }
  }, []);

  const contextValue: AuthContextProps = {
    user,
    setUser,
    login,
    logout,
    signup,
    setCartItemNumber,
    cartItemNumber,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useUserAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useuseUserAuth must be used within an AuthContextProvider");
  }
  return context;
};
