import { Heading, SimpleGrid, Stack, VStack, CartItem, CartOrderSummary, Section } from '@3shop/ui';
import { FormProvider, useForm } from 'react-hook-form';

import { ShippingForm } from './ShippingForm';
import type { ShippingFormValues } from './types';
import omit from 'lodash/omit';
import type { Product } from '@3shop/apollo';
import { useCreateOrderMutation } from '@3shop/apollo';
import { applyDiscount } from '@3shop/pure';
import { useIsAnHolder } from '@/hooks/useIsAnHolder';
import { yupResolver } from '@hookform/resolvers/yup';
import { SHIPPING_FORM_SCHEMA } from '@/schemas';
import { useNavigate } from 'react-router-dom';
import { storeOrder } from '@3shop/store/slices/order';
import { useDispatch } from 'react-redux';
import { envVars } from '@3shop/config';
import { useAppSelector } from '@3shop/store';

type ShippingFormContainerProps = {
  product: Product;
};

export const ShippingFormContainer = ({ product }: ShippingFormContainerProps) => {
  const { id, price, name, image, discount, curation, poapId } = product;

  const deliveryTaxes = useAppSelector((state) => state.deliveryTaxes);

  const methods = useForm<ShippingFormValues>({
    mode: 'onChange',
    resolver: yupResolver(SHIPPING_FORM_SCHEMA),
  });

  const {
    handleSubmit,
    formState: { isValid },
    watch,
  } = methods;

  const [createOrder] = useCreateOrderMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const country = watch('country');
  const fees = deliveryTaxes.data.find((zone) => zone.name === country)?.fees;

  function showDiscount() {
    if (!curation && !poapId) return true;
    if (isAnHolder) return true;
    return false;
  }

  const isAnHolder = useIsAnHolder(product);
  const amount = applyDiscount(price + (fees || 0), showDiscount() ? Number(discount) : undefined);

  const onSubmit = async (data: ShippingFormValues) => {
    dispatch(storeOrder({ ...data, amount }));

    if (amount === 0) {
      await createOrder({
        variables: {
          ...omit(data, 'country'),
          product_id: id,
          app_id: envVars.APP_ID,
        },
      });

      return navigate('/success');
    }

    navigate(`/checkout/${id}`);
  };

  return (
    <FormProvider {...methods}>
      <Heading as="h2">Shipping Informations</Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={2} spacing={4} minChildWidth="350px">
          <VStack flex={1}>
            <ShippingForm />
          </VStack>

          <VStack flex={1} justifyContent="space-between">
            <Section>
              <Stack spacing="6">
                <CartItem
                  currency="EUR"
                  price={amount}
                  name={name}
                  description={name}
                  imageUrl={image}
                />
              </Stack>
            </Section>

            <CartOrderSummary fees={fees} isDisabled={!isValid} amount={amount} />
          </VStack>
        </SimpleGrid>
      </form>
    </FormProvider>
  );
};
