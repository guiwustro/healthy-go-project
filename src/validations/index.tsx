import * as yup from "yup";

export const registerFormSchema = yup.object().shape({
  name: yup.string().required("Nome é um campo necessário"),
  email: yup
    .string()
    .required("E-mail é um campo necessário")
    .email("Precisa ser uum e-mail válido"),
  password: yup.string().required("Senha é um campo necessário"),
  confirmPassword: yup
    .string()
    .required("A confirmação da senha é necessária")
    .oneOf([yup.ref("password")], "As senhas não estão iguais"),
});