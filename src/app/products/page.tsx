
import { getAllProducts, getBrands, getCategories, getMaxPrice } from "@/lib/products";
import ProductsClient from "./products-client";

export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams?: { [key: string]: string | string[] | undefined } 
}) {
  const allProducts = await getAllProducts();
  const brands = getBrands(allProducts);
  const categories = getCategories(allProducts);
  const maxPrice = getMaxPrice(allProducts);

  // Parse searchParams on the server to pass to the client
  const searchTerm = searchParams?.search as string || "";
  
  const priceParam = searchParams?.price as string || `0-${maxPrice}`;
  const priceRange = priceParam.split('-').map(Number) as [number, number];

  const categoryParams = searchParams?.category;
  const selectedCategories = Array.isArray(categoryParams) ? categoryParams : typeof categoryParams === 'string' ? [categoryParams] : [];
  
  const brandParams = searchParams?.brand;
  const selectedBrands = Array.isArray(brandParams) ? brandParams : typeof brandParams === 'string' ? [brandParams] : [];
  
  const sortBy = searchParams?.sortBy as string || "featured";

  return (
    <ProductsClient 
      initialProducts={allProducts} 
      brands={brands} 
      categories={categories}
      maxPrice={maxPrice}
      initialSearch={searchTerm}
      initialPriceRange={priceRange}
      initialCategories={selectedCategories}
      initialBrands={selectedBrands}
      initialSortBy={sortBy}
    />
  );
}
