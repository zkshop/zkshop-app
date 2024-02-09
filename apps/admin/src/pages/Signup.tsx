import { Grid, GridItem, SignupSection, useToastMessage } from '@3shop/ui';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormValidation } from '@3shop/validation';

import { httpServerless } from '@3shop/http-serverless';
import { useState } from 'react';
import { AuthAdminService } from '@3shop/domains';
import { CustomerAuthClient } from '@3shop/admin-infra';
import { useCustomerTokenCookie } from '../useCustomerTokenCookie';
import { ROUTES_PATH } from '../routes/Routes';
import { useNavigate } from 'react-router-dom';

import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';
import { envVars } from '@3shop/config';
import axios from 'axios';

const magic = new Magic(envVars.PUBLIC_MAGIC_PUBLISHABLE_KEY!, {
  extensions: [new OAuthExtension()],
});

type SignupFormValues = {
  email: string;
};

const SIGNUP_SCHEMA = FormValidation.object().shape({
  email: FormValidation.string().email().required(),
});

const auth = AuthAdminService(CustomerAuthClient());
type OauthProviderCallback = (method: 'signup' | 'signin') => void;
export interface OauthProviders {
  google: OauthProviderCallback;
  github: OauthProviderCallback;
}

export const Oauth: OauthProviders = {
  async google() {
    const url = new URL(window.location.href);
    const redirectURI = `${url.origin}/oauth/callback?auth_method=${arguments[0]}`;
  
    await magic.oauth.loginWithRedirect({
      provider: 'google',
      redirectURI,
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
    });
  },
  async github() {},
};

export const Signup = () => {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: yupResolver(SIGNUP_SCHEMA),
    mode: 'onBlur',
  });
  const { setCustomerTokenCookie } = useCustomerTokenCookie();
  const navigate = useNavigate();
  const toast = useToastMessage();

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setLoading(true);
      await httpServerless.post('api/create-app', {
        email: data.email,
        name: `${data.email}'s app`,
      });

      toast.success("Your app is ready! We're setting things up for you.");

      const res = await auth.login(data.email);

      if (res.token) {
        setCustomerTokenCookie(res.token);

        navigate(ROUTES_PATH.PROTECTED.INTEGRATIONS);
      }
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        const { status } = error.response;

        if (status == 409) {
          toast.error(`An account with this email already exists. Please login.`);
          return;
        }
      } else toast.error('Something went wrong');
    }
  };

  return (
    <Grid
      minW="calc(100vw - --chakra-sizes-0.5)"
      minH="calc(100vh)"
      templateColumns="repeat(3, 1fr)"
    >
      <GridItem paddingX={14} paddingY={5} colSpan={1}>
        <SignupSection
          errors={errors}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          register={register}
          loading={loading}
        />
      </GridItem>
      <GridItem
        bgColor="#D9D9D9"
        colSpan={2}
        backgroundImage="magic-city.png"
        backgroundRepeat="no-repeat"
        background="url('magic-city.png') no-repeat"
        backgroundSize="cover"
      />
    </Grid>
  );
};
