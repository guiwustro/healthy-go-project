import React from "react";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import { ICompleteAddress } from "../../../contexts/addressContext";
import { useRequestsUserContext } from "../../../contexts/requestsUserContext";
import { requestFormSchema } from "../../../validations";
import { PayamentForm } from "./checkout-pagamento";
import { SelectAddressForm } from "./checkout-select-address";

interface IUserPayament {
  payament: string;
  cvv: string;
  validityDate: string;
  titularName: string;
  cardNumber: number;
  address: ICompleteAddress;
}

const CheckoutForm = () => {
  const { postUserRequest } = useRequestsUserContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserPayament>({
    resolver: yupResolver(requestFormSchema),
  });

  console.log(errors);

  const Submit = (data: IUserPayament) => {
    const payamentObject = {
      payament: data.payament,
    };
    console.log(payamentObject);
    postUserRequest(payamentObject);
  };

  return (
    <form id="payamentForm" onSubmit={handleSubmit(Submit)}>
      <SelectAddressForm register={register} />
      <PayamentForm register={register} />
    </form>
  );
};

export default CheckoutForm;