import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiHide, BiShow } from "react-icons/bi";

import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import * as yup from "yup";

import Image from "../../assets/order-food.png";
import {
  GlobalButtonLg,
  GlobalInputLg,
  GlobalInputPassword,
} from "../../components/global-inputs";
import { GoogleAuthLogin } from "../../components/google-auth-login";
import Loading from "../../components/loading";
import { IUserLogin, useAuthUserContext } from "../../contexts/authUserContext";
import { useRestaurantsContext } from "../../contexts/restaurantsContext";
import { CenteringContainer, FormDiv, Form, Img, ShowPassword } from "./styles";

export const Login = () => {
  const { loginUser } = useAuthUserContext();
  const { isLoading } = useRestaurantsContext();

  const [showPassword, setShowPassword] = useState(false);

  if (isLoading) return <Loading />;

  const formSchema = yup.object().shape({
    email: yup.string(),
    password: yup.string(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserLogin>({
    resolver: yupResolver(formSchema),
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <CenteringContainer>
        <Img src={Image} alt="Woman ordering" />
        <FormDiv>
          <p>Já tenho cadastro</p>
          <Form onSubmit={handleSubmit(loginUser)}>
            <GlobalInputLg
              type="text"
              label="E-mail"
              register={register}
              registerName="email"
              errors={errors.email?.message}
            />
            <ShowPassword>
              <GlobalInputPassword
                type={showPassword ? "text" : "password"}
                label="Password"
                register={register}
                registerName="password"
                errors={errors.password?.message}
              />
              <button
                type="button"
                className="password-show__button"
                onClick={() => setShowPassword((old) => !old)}
              >
                {showPassword ? <BiShow /> : <BiHide />}
              </button>
            </ShowPassword>
            <GlobalButtonLg type="submit">Acessar Conta</GlobalButtonLg>
            <p>Não tem conta cadastro? Faça aqui!</p>
            <p>Ou entre com:</p>
            <GoogleAuthLogin />
          </Form>
        </FormDiv>
      </CenteringContainer>
    </motion.div>
  );
};

export default Login;
