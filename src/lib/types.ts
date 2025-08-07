export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
  dataAiHint: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
