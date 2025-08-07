
import { products, getBrands, getCategories, getMaxPrice } from "@/lib/products";
import ProductsClient from "./products-client";

export default async function ProductsPage() {
  const allProducts = products;
  const brands = getBrands();
  const categories = getCategories();
  const maxPrice = getMaxPrice();

  return (
    <ProductsClient 
      initialProducts={allProducts} 
      brands={brands} 
      categories={categories}
      maxPrice={maxPrice}
    />
  );
}
