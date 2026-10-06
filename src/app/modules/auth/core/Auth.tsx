/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  FC,
  Dispatch,
  SetStateAction,
} from "react";
import { AuthModel, UserModel } from "./_models";
import { authAPI, TOKEN_KEY, USER_KEY } from "../../../../services/api";
import { LayoutSplashScreen } from "../../../../_metronic/layout/core";
import { WithChildren } from "../../../../_metronic/helpers";

type AuthContextProps = {
  auth?: AuthModel;
  saveAuth: (auth?: AuthModel) => void;
  currentUser?: UserModel;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextProps>({
  saveAuth: () => {},
  setCurrentUser: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC<WithChildren> = ({ children }) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { api_token: token } : undefined;
  });

  const [currentUser, setCurrentUser] = useState<UserModel | undefined>(() => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : undefined;
  });

  const saveAuth = (auth?: AuthModel) => {
    setAuth(auth);
    if (auth) localStorage.setItem(TOKEN_KEY, auth.api_token);
    else localStorage.removeItem(TOKEN_KEY);
  };

  const saveUser: Dispatch<SetStateAction<UserModel | undefined>> = (value) => {
    setCurrentUser((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      if (next) localStorage.setItem(USER_KEY, JSON.stringify(next));
      else localStorage.removeItem(USER_KEY);
      return next;
    });
  };

  const logout = () => {
    saveAuth(undefined);
    saveUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{ auth, saveAuth, currentUser, setCurrentUser: saveUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/** ກວດ token ຕອນເປີດແອັບ: ຖ້າ token ໃຊ້ບໍ່ໄດ້ → logout */
export const AuthInit: FC<WithChildren> = ({ children }) => {
  const { auth, setCurrentUser, logout } = useAuth();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        if (auth?.api_token) {
          setCurrentUser(await authAPI.me());
        } else {
          logout();
        }
      } catch (error) {
        console.error(error);
        logout();
      } finally {
        setShowSplashScreen(false);
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>;
};
