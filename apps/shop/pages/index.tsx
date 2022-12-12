import type { QueryResult } from '@apollo/client';
import { useEffect } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import { useAccount } from 'wagmi';

import useUpdateThemeOnConnection from '../hooks/useUpdateThemeOnConnection';

import type { GetProductsQuery } from 'apollo';
import { initializeApollo, addApolloState, GetProductsDocument } from 'apollo';

import { ProductListContainer } from 'modules';
import { useAppDispatch } from 'store';
import { fetchPOAPImageList } from 'store/slices/poapImageList';

type MarketplaceProps = {
  productsQueryResult: QueryResult<GetProductsQuery>;
};

const Marketplace = ({ productsQueryResult }: MarketplaceProps) => {
  const { data, loading, error } = productsQueryResult;
  const {} = useUpdateThemeOnConnection();
  const { isConnected } = useAccount();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      dispatch(
        fetchPOAPImageList(
          data.products.filter(({ poapId }) => poapId !== null).map(({ poapId }) => poapId),
        ),
      );
    }
  }, [data, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data || error) {
    return null;
  }

  return (
    <>
      <ReactCanvasConfetti fire={isConnected} className="canvas" />

      <ProductListContainer products={data?.products} />
    </>
  );
};

export default Marketplace;

export async function getServerSideProps() {
  const apolloClient = initializeApollo();
  const productsQueryResult = await apolloClient.query({
    query: GetProductsDocument,
    variables: {
      appId: process.env.APP_ID,
    },
  });

  return addApolloState(apolloClient, {
    props: { productsQueryResult },
  });
}
