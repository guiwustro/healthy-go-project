import { createContext, ReactNode, useContext, useState } from "react";

interface IModalContextProviderData {
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IModalContextProps {
  children: ReactNode;
}

const ModalContext = createContext({} as IModalContextProviderData);

export const ModalProvider = ({ children }: IModalContextProps) => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  return (
    <ModalContext.Provider
      value={{ isAddressModalOpen, setIsAddressModalOpen }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);
