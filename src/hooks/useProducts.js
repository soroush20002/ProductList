import useSWR from 'swr';
import axios from 'axios';

const fetcher = url => axios.get(url).then(res => res.data);

export default function useProducts() {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_PRODUCT_API}/products?limit=200`,
    fetcher
  );

  return {
    products: data?.products || [],
    isLoading,
    error,
  };
}
