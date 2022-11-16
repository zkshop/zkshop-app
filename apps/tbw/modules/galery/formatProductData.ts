import { getPoapImageFromPoapList } from 'pure';
import { Product } from 'apollo';
import { FormatedProductData } from 'types';

export type GetProductCardPropsParams = Product & {
  poapImageList: any[];
  poapIds: number[];
  collections: string[];
};

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
  poapId,
  poapImageList,
  collections,
  poapIds,
}: GetProductCardPropsParams): FormatedProductData => {
  const isGated = curation || poapId;
  const isAPoapHolder = poapIds.includes(poapId);
  const isAnNftHolder = collections.includes(curation?.toLowerCase());
  const isAnHolder = isAnNftHolder || isAPoapHolder;
  const isTransparent = isGated && !isAnHolder && !isDiscountGated;
  const poapUrl = `https://poap.gallery/event/${poapId}`;
  const poapImgUrl = getPoapImageFromPoapList(poapId, poapImageList);
  const priceNumber = parseInt(price);
  const discountNumber = discount ? parseInt(discount) : 0;
  const promoPercent = discount ? discountNumber / 100 : 0;
  const priceReduced = discount ? priceNumber - priceNumber * promoPercent : 0;

  const showDiscount = (() => {
    if (discount) {
      if (isDiscountGated) {
        return isAnHolder;
      }
      return true;
    }
    return false;
  })();

  const memberStackLink =
    id === '51e46fb2-cd9e-4baf-81db-8df9d58b62b2'
      ? '#/ms/signup/6372923763918000040c740f'
      : undefined;

  return {
    externalLink: memberStackLink,
    isAnHolder,
    isTransparent,
    poapUrl,
    poapImgUrl,
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
