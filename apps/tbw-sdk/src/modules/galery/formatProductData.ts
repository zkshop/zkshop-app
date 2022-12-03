import { Product } from 'apollo';
import { FormatedProductData } from 'ui-tbw';
import { getExternalLink } from './getExternalLink';

export type GetProductCardPropsParams = Product & {
  collections: string[];
};

const MEMBER_STACK_PRODUCT_ID = '51e46fb2-cd9e-4baf-81db-8df9d58b62b2';
const HIGHLIGHTED_PRODUCT_ID = 'ebb24d16-6b6f-464b-bb54-897482b4bc67';

export const formatProductData = ({
  image,
  name,
  discount,
  description,
  price,
  collection,
  curation,
  id,
  isDiscountGated,
  collections,
}: GetProductCardPropsParams): FormatedProductData => {
  const isGated = curation;
  const isAnNftHolder = collections.includes(curation?.toLowerCase());
  const isTransparent = isGated && !isAnNftHolder && !isDiscountGated;
  const priceNumber = parseInt(price);
  const discountNumber = discount ? parseInt(discount) : 0;
  const promoPercent = discount ? discountNumber / 100 : 0;
  const priceReduced = discount ? priceNumber - priceNumber * promoPercent : 0;

  const showDiscount = (() => {
    if (discount) {
      if (isDiscountGated) {
        return isAnNftHolder;
      }
      return true;
    }
    return false;
  })();

  const highlight = id === HIGHLIGHTED_PRODUCT_ID;
  const externalLink = getExternalLink(id);

  // TODO: replace with the real logic, it's just for the demo
  const isLocked = id === MEMBER_STACK_PRODUCT_ID;

  return {
    isLocked,
    highlight,
    externalLink,
    isAnHolder: isAnNftHolder,
    isTransparent,
    srcItem: image,
    title: name,
    discount: showDiscount && discount,
    description,
    price,
    priceReduced,
    collection,
    id,
  };
};
