import { UseFormRegister } from "react-hook-form";

import locationIcon from "../../../../assets/locationIcon.svg";
import { useAuthUserContext } from "../../../../contexts/authUserContext";
import { useModalContext } from "../../../../contexts/modalContext";
import { ContainerAdress, DivAdress, DivPicture } from "./style";

interface ISelectAddressForm {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
}

export const SelectAddressForm = ({ register }: ISelectAddressForm) => {
  const { user } = useAuthUserContext();
  const { setIsAddressModalOpen } = useModalContext();
  return (
    <ContainerAdress>
      <div>
        <h2>Selecione seu endereço</h2>
        <button onClick={() => setIsAddressModalOpen(true)}>
          + Adicionar Endereço
        </button>
      </div>
      <DivAdress>
        {user?.address?.map((address, index) => {
          return (
            <div key={address.id}>
              <h4>{address.adressIdentification}</h4>
              <DivPicture>
                <img src={locationIcon} />
              </DivPicture>
              <p>
                <span>{address.street} </span>
                <span>{address.number} </span>
                <span>{address.district} </span>
                <span>{address.city} </span>
                <span>{address.state} </span>
                <span>{address.postal} </span>
              </p>
              <input
                {...register("address")}
                type="radio"
                name="address"
                value={index}
              />
            </div>
          );
        })}
      </DivAdress>
    </ContainerAdress>
  );
};