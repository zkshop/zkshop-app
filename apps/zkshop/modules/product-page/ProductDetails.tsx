import { Box, Text, Button, Image, HStack, VStack } from '@chakra-ui/react';
import { GoTriangleUp } from 'react-icons/go';
import { CollectionBadge, SizeSelector, PoapBadge } from 'ui';

import useTransaction from '../../hooks/useTransaction';

interface ProductDetailsProps {
  id?: string;
  srcItem: string;
  title: string;
  discount?: string;
  price: string;
  collection: string;
  isTransparent: boolean;
  isEligible: boolean | string;
  description?: string;
  poapImgUrl?: string;
}

export const ProductDetails = ({
  id,
  srcItem,
  title,
  discount,
  price,
  collection,
  isTransparent,
  isEligible,
  description,
  poapImgUrl,
}: ProductDetailsProps) => {
  const priceNumber = parseInt(price);
  const discountNumber = discount ? parseInt(discount) : 0;

  const promoPercent = discount ? discountNumber / 100 : 0;
  const priceReduced = discount ? priceNumber - priceNumber * promoPercent : 0;

  const { sendTransaction } = useTransaction(discount ? priceReduced : priceNumber);

  return (
    <Box
      position="relative"
      width="780px"
      bg="white"
      boxShadow="rgba(0, 0, 0, 0.2) 0px 2px 4px"
      marginTop="32px !important"
      _before={
        isEligible
          ? {
              content: '""',
              zIndex: -1,
              position: 'absolute',
              top: '-12px',
              right: '-12px',
              bottom: '-12px',
              left: '-12px',
              background:
                'linear-gradient(to right, var(--chakra-colors-bannerLeft) , var(--chakra-colors-bannerRight))',
              transition: 'opacity 0.3s',
              borderRadius: 'inherit',
              filter: 'blur(5px)',
              opacity: 0.9,
            }
          : {}
      }
      _after={
        isEligible
          ? {
              content: '""',
              zIndex: -1,
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: 'inherit',
            }
          : {}
      }
    >
      <CollectionBadge collectionName={collection} imgUrl={poapImgUrl} />
      {isTransparent && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              opacity: 0.4,
            }}
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            bgColor="black"
          />
          <Text
            px={1}
            position="absolute"
            top={190}
            textAlign="center"
            color="white"
            fontWeight="bold"
            fontSize="2xl"
            width="100%"
          >
            Connect your {collection || 'Misfitwear'} wallet to unlock
          </Text>
        </>
      )}
      <HStack alignItems="stretch">
        <Box>
          <Image alt="product" height="500px" src={srcItem} />
        </Box>

        <VStack flex={1} justifyContent="space-between">
          <VStack flex={1}>
            <Box alignSelf="flex-start">
              <Text
                fontWeight="bold"
                fontSize="24px"
                color="black"
                mt={1}
                p={1}
                background="#EEEEEF"
                textTransform="capitalize"
                width="fit-content"
              >
                {title}
              </Text>
            </Box>

            <Text sx={{ fontsize: '14px', color: 'black', p: 1 }}>{description}</Text>
          </VStack>

          <Box flex={1} width="100%" p={2}>
            <SizeSelector />
            <Box display="flex" justifyContent="space-between" alignItems="flex-end">
              {discount ? (
                <Box
                  border="1px #dedde0 solid"
                  width="50px"
                  borderRadius="10px"
                  padding="2px"
                  marginTop="4px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontWeight="bold" fontSize="14px" color="black" padding="2px">
                    {`-${discount}%`}
                  </Text>
                </Box>
              ) : (
                <Box />
              )}

              <Box display="flex">
                <Text
                  fontWeight="bold"
                  fontSize="16px"
                  color="black"
                  padding="2px"
                  textDecoration={discount ? 'line-through' : 'none'}
                  marginRight={discount ? '2px' : 'none'}
                >
                  {`${price}$`}
                </Text>
                {discount && (
                  <Text fontWeight="bold" fontSize="16px" color="#FF5F1F" padding="2px">
                    {`${priceReduced}$`}
                  </Text>
                )}
              </Box>
            </Box>

            <Box mt={2}>
              <Button
                as="a"
                height="48px"
                width="100%"
                borderRadius="10px"
                p={1}
                isDisabled={isTransparent}
                bg="#4473c3"
                _hover={{ bg: '#5686d8' }}
                href={`/shipping/${id}`}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Text
                    fontWeight="bold"
                    fontSize="16px"
                    color="white"
                    mr={1}
                    textTransform="uppercase"
                  >
                    Pay in fiat
                  </Text>

                  <Box borderRadius="10px" display="flex">
                    <GoTriangleUp style={{ marginLeft: '8px' }} color="white" />
                  </Box>
                </Box>
              </Button>
            </Box>

            <Box mt={2}>
              <Button
                onClick={() => {
                  sendTransaction?.();
                }}
                height="48px"
                width="100%"
                borderRadius="10px"
                p={1}
                isDisabled={isTransparent}
                bg="#e89938"
                _hover={{ bg: '#f7ad54' }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Text
                    fontWeight="bold"
                    fontSize="16px"
                    color="white"
                    mr={1}
                    textTransform="uppercase"
                  >
                    Pay in crypto
                  </Text>

                  <Box borderRadius="10px" display="flex">
                    <GoTriangleUp style={{ marginLeft: '8px' }} color="white" />
                  </Box>
                </Box>
              </Button>
            </Box>
          </Box>
        </VStack>
      </HStack>
    </Box>
  );
};
