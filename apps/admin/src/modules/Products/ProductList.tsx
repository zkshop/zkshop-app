import { Box, Table, Link, Button, Header, Spinner } from '@3shop/ui';

import { PRODUCT_ATTRIBUTES } from './constants';
import { ProductListItem } from './ProductListItem';

import { useGetAdminProductsQuery } from '@3shop/apollo';
import { useNavigate } from 'react-router-dom';

const getEditProductIdRoute = (id: string) => `product/edit/${id}`;

export const Products = () => {
  const { data, error, loading } = useGetAdminProductsQuery();
  const navigate = useNavigate();

  if (loading) return <Spinner />;

  if (error || !data) {
    return <div>Error</div>;
  }

  return (
    <Box>
      <Header title="Products">
        <Link href="/app/product/add">
          <Button>+ New Product</Button>
        </Link>
      </Header>

      <Table
        data={data.products}
        heads={PRODUCT_ATTRIBUTES}
        renderRow={({ id, image, name, price, discount, collection, curation }) => (
          <ProductListItem
            key={id}
            id={id}
            image={image}
            name={name}
            price={price}
            discount={discount}
            collection={collection}
            collectionAddress={curation}
            goToProduct={() => navigate(getEditProductIdRoute(id))}
          />
        )}
      />
    </Box>
  );
};
