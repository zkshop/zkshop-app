import { mapWindowAttributeToEnvVar } from './mapWindowAttributeToEnvVar';

const NODE_ENV = process.env.NODE_ENV || 'development';

const envVars = {
  APP_ID: mapWindowAttributeToEnvVar('APP_ID'),
  MONTHLY_PRO_PLAN_CHECKOUT_LINK: process.env.MONTHLY_PRO_PLAN_CHECKOUT_LINK,
  NETWORK: mapWindowAttributeToEnvVar('NETWORK'),
  NODE_ENV,
  PAPER_CLIENT_ID: process.env.PAPER_CLIENT_ID,
  POSTHOG_KEY: 'phc_NL98HSOKoKpH1YhIuYCEmFgXAl9yVUaGryiwutmYaeI',
  PUBLIC_FUNCTIONS_URL: process.env.PUBLIC_FUNCTIONS_URL,
  PUBLIC_HASURA_API_URL: process.env.PUBLIC_HASURA_API_URL,
  PUBLIC_MAGIC_PUBLISHABLE_KEY: process.env.PUBLIC_MAGIC_PUBLISHABLE_KEY,
  PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.PUBLIC_STRIPE_PUBLISHABLE_KEY,
  SECRET_AIRTABLE: process.env.SECRET_AIRTABLE,
  SECRET_ALCHEMY: process.env.SECRET_ALCHEMY,
  SECRET_BREVO: process.env.SECRET_BREVO,
  SECRET_CENTER: 'key0496d7622616d32fbb5f9595',
  SECRET_HASURA: process.env.SECRET_HASURA,
  SECRET_JWT: process.env.SECRET_JWT,
  SECRET_MAGIC: process.env.SECRET_MAGIC,
  SECRET_PAPER: process.env.SECRET_PAPER,
  SECRET_POAP: process.env.SECRET_POAP,
  SECRET_RUDDERSTACK: '2K5u9A4bXrAezmrsx75x1DBJTg5',
  SECRET_STRIPE: process.env.SECRET_STRIPE,
  SECRET_SUPABASE: process.env.SECRET_SUPABASE,
  SERVERLESS_API_KEY: process.env.SERVERLESS_API_KEY,
  SORCEL_PRODUCT_ID: mapWindowAttributeToEnvVar('PRODUCT_ID'),
  WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID,
  YEARLY_PRO_PLAN_CHECKOUT_LINK: process.env.YEARLY_PRO_PLAN_CHECKOUT_LINK,
  SECRET_BITHOMP: process.env.SECRET_BITHOMP
};

export { envVars };
