import { useToast } from 'ui';
import { useCreateProductMutation } from 'apollo';
import axios from 'axios';
import { getAddProductSuccessMessage } from 'messages';
import { useRouter } from 'next/router';
import { blobFromURL, toNumber } from 'pure';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProductForm } from './ProductForm';
import { AddProductFormValues } from './types';
import { ADD_PRODUCT_FORM_SCHEMA } from '../../../schemas';
import { StorageService } from 'domains';
import { ImageStorageClient } from 'admin-infra';
import { useNavigate } from 'react-router-dom';

const storage = StorageService(ImageStorageClient());

export const AddProductFormContainer = () => {
  const [storageActionLoading, setStorageActionLoading] = useState(false);
  const methods = useForm<AddProductFormValues>({
    defaultValues: {},
    resolver: yupResolver(ADD_PRODUCT_FORM_SCHEMA),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const navigate = useNavigate();

  const [createProduct, { loading: isLoading }] = useCreateProductMutation();

  const toast = useToast();

  const onSubmit = async (data: AddProductFormValues) => {
    try {
      setStorageActionLoading(true);
      const image = await blobFromURL(data.image);
      const uploadUrl = await storage.uploadPicture(image, 'products');

      setStorageActionLoading(false);

      await createProduct({
        variables: {
          ...data,
          appId: process.env.APP_ID,
          price: toNumber(data.price),
          discount: toNumber(data.discount),
          poapId: toNumber(data.poapId),
          image: uploadUrl,
        },
        onCompleted: () => toast(getAddProductSuccessMessage(data.name)),
      });

      navigate('/');
    } catch (e) {
      console.error(e);
    } finally {
      setStorageActionLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <ProductForm
        isDisabled={!isValid}
        isLoading={storageActionLoading || isLoading}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
};
