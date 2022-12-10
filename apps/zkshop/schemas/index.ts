import { FormValidation } from 'validation';
import { REQUIRED } from 'messages';

export const SHIPPING_FORM_SCHEMA = FormValidation.object().shape({
  firstname: FormValidation.string().required(REQUIRED),
  lastname: FormValidation.string().required(REQUIRED),
  address: FormValidation.string().required(REQUIRED),
  email: FormValidation.string().email().required(REQUIRED),
  phoneNumber: FormValidation.string().required(REQUIRED),
});
