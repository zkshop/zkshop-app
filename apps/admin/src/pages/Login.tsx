import { REQUIRED } from '@3shop/messages';
import { useForm } from 'react-hook-form';
import {
  Section,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  FormErrorMessage,
} from '@3shop/ui';
import { FormValidation } from '@3shop/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthAdminService } from '@3shop/domains';
import { CustomerAuthClient } from '@3shop/admin-infra';
import { useCustomerTokenCookie } from '../useCustomerTokenCookie';
import { useNavigate } from 'react-router-dom';
import { useVerifyToken } from '../useVerifyToken';
import { useState } from 'react';
import { ROUTES_PATH } from '../routes/Routes';

type LoginFormValues = {
  email: string;
};

const LOGIN_SCHEMA = FormValidation.object().shape({
  email: FormValidation.string().email().required(REQUIRED),
});

const auth = AuthAdminService(CustomerAuthClient());

export const Login = () => {
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const navigate = useNavigate();
  const { setCustomerTokenCookie } = useCustomerTokenCookie();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
    resolver: yupResolver(LOGIN_SCHEMA),
  });

  const {} = useVerifyToken();

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoginLoading(true);
    const res = await auth.login(data.email);
    if (res.token) {
      setCustomerTokenCookie(res.token);

      navigate(ROUTES_PATH.PROTECTED.GENERAL);
    }

    setIsLoginLoading(false);
  };

  return (
    <form onClick={handleSubmit(onSubmit)}>
      <Section>
        <Heading fontSize="xl"> Login </Heading>

        <FormControl isInvalid={Boolean(errors.email)}>
          <FormLabel mb={1}> Email </FormLabel>
          <HStack>
            <Input placeholder="vitalik@ethereum.fr" {...register('email')} />
            <Button isLoading={isLoginLoading} isDisabled={isLoginLoading}>
              Login
            </Button>
          </HStack>
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
      </Section>
    </form>
  );
};
