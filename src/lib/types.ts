
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number; // Price in cents
  image: string;
  category: string;
  brand: string;
  tags?: string[];
  dataAiHint: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type User = {
    id: string;
    name: string;
    email: string;
    password?: string; // It's optional as we might not always send it to the client
    role: 'admin' | 'user';
};

export type LoginCredentials = Pick<User, 'email' | 'password'>;
export type SignUpCredentials = Pick<User, 'name' | 'email' | 'password'>;
