import {
  useState,
  useEffect,
  ReactNode,
  useContext,
  createContext,
} from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import { api } from "../services";
import { ICompleteAddress } from "./addressContext";
import { IProduct } from "./restaurantProductsContext";

interface IAuthUserProviderData {
  user: IUser | undefined;
  getUser: (id: string) => void;
  registerUser: (user: IUser) => void;
  loginUser: (user: IUserLogin) => void;
  editUser: (data: IUser, id: string) => void;
  logoutUser: () => void;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  cart: IProduct[] | undefined;
  setCart: React.Dispatch<React.SetStateAction<IProduct[] | undefined>>;
  removeAddress: (data: ICompleteAddress, id: string) => void;
}

export interface IUserLogin {
  email?: string;
  password?: string;
}
interface IUserResponse {
  data: {
    user: IUser;
    accessToken: string;
  };
}

export interface IUserRequests {
  id: string;
  status: string;
  date: string;
  payament: string;
  total: number;
}

export interface IUser extends IUserLogin {
  id?: string;
  name: string;
  type?: string;
  avatar?: string;
  email2?: string;
  birthday?: string;
  cellphone?: string;
  address?: ICompleteAddress[];
  requests?: IUserRequests[];
  cart?: IProduct[] | undefined;
}
export interface IUserEditRes {
  data: IUser;
}

interface IAuthUserProps {
  children: ReactNode;
}

const AuthUserContext = createContext({} as IAuthUserProviderData);

export const AuthUserProvider = ({ children }: IAuthUserProps) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // const initialUser = JSON.parse(localStorage.getItem("@healthyGo-user")!);
  const [user, setUser] = useState({} as IUser);
  const [cart, setCart] = useState<IProduct[] | undefined>(undefined);

  const navigate = useNavigate();
  const actualPage = useLocation().pathname;

  const loginUser = (data: IUserLogin) => {
    api
      .post("/login", data)
      .then((res: IUserResponse) => {
        setUser(res.data.user);
        if (res.data.user.cart) {
          setCart(res.data.user.cart);
        }
        const userLocalStorage = JSON.stringify(res.data.user);
        if (res.data.user.id) {
          localStorage.setItem("@healthyGo-userId", res.data.user.id);
        }
        localStorage.setItem("@healthyGo-user", userLocalStorage);

        localStorage.setItem("@healthyGo-token", res.data.accessToken);

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.accessToken}`;

        navigate("/homepage", { replace: true });
      })
      .catch((err) => {
        if (err.response.data === "Cannot find user")
          toast.error("A senha ou e-mail inserido é inválido.", {
            id: "error-login",
          });
      });
  };

  const registerUser = (data: IUser) => {
    api
      .post("/register", data)
      .then(() => {
        actualPage === "/login"
          ? loginUser(user)
          : navigate("/login", { replace: true });
      })
      .catch(() => {
        loginUser(user);
      });
  };

  useEffect(() => {
    const id = localStorage.getItem("@healthyGo-userId");
    const token = localStorage.getItem("@healthyGo-token");
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    if (token) {
      api
        .get(`/users/${id}`)
        .then((res) => {
          setUser(res.data);
          setCart(res.data.cart);
        })
        .catch(() => {
          localStorage.removeItem("@healthyGo-userId");
          localStorage.removeItem("@healthyGo-token");
          localStorage.removeItem("@healthyGo-user");

          setUser({} as IUser);
          setCart([] as IProduct[]);
        });
    }
  }, []);

  const editUser = (data: IUser, id: string) => {
    api
      .patch(`/users/${id}`, data)
      .then((res: IUserEditRes) => {
        setUser(res.data);
      })
      .catch(() =>
        toast.error(
          "Não foi possível fazer essa alteração no nosso banco de dados, tente novamente mais tarde.",
        ),
      );
  };

  const getUser = (id: string) => {
    useEffect(() => {
      api
        .get(`/users/${id}`)
        .then((res: IUserEditRes) => {
          setUser(res.data);
          if (res.data.cart) setCart(res.data.cart);
        })
        .catch((err) => console.log(err));
    }, []);
  };

  const logoutUser = () => {
    setUser({} as IUser);
    setCart([] as IProduct[]);

    localStorage.removeItem("@healthyGo-userId");
    localStorage.removeItem("@healthyGo-token");
    localStorage.removeItem("@healthyGo-user");
  };

  const removeAddress = (data: ICompleteAddress, id: string) => {
    let newUser;
    if (user.address) {
      const newUserAddress = user.address.filter((address) => address.id != id);
      newUser = { ...user, address: newUserAddress };
    }
    api
      .patch(`/users/${user.id}`, newUser)
      .then((res: IUserEditRes) => {
        setUser(res.data);
      })
      .catch(() =>
        toast.error(
          "Não foi possível fazer essa alteração no nosso banco de dados, tente novamente mais tarde.",
        ),
      );
  };

  return (
    <AuthUserContext.Provider
      value={{
        user,
        loginUser,
        registerUser,
        editUser,
        getUser,
        logoutUser,
        setUser,
        setCart,
        cart,
        removeAddress,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
};

export const useAuthUserContext = () => useContext(AuthUserContext);
