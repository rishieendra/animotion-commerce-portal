
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

// Define types
export type ProductCategory = 
  | 'UPVC' 
  | 'Aluminium' 
  | 'Steel' 
  | 'Glass' 
  | 'Iron' 
  | 'WPVC' 
  | 'ABS';

export type ProductSubcategory = 
  | 'Windows' 
  | 'Doors' 
  | 'Ventilators' 
  | 'Partitions' 
  | 'Grill' 
  | 'Railings' 
  | 'Main gate';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  subcategory: ProductSubcategory;
  material: string;
  size: string;
  inStock: boolean;
  featured: boolean;
};

type ProductContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductsByCategory: (category: ProductCategory) => Product[];
  getFeaturedProducts: () => Product[];
};

// Sample product data
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Sliding UPVC Window',
    description: 'Energy-efficient sliding window with double glazing',
    price: 29000,
    image: 'https://images.unsplash.com/photo-1503377984674-b8b25b059080?auto=format&fit=crop&w=1200&h=800',
    category: 'UPVC',
    subcategory: 'Windows',
    material: 'UPVC',
    size: '48" x 36"',
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'UPVC French Door',
    description: 'Classic French door design with modern UPVC material',
    price: 53500,
    image: 'https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?auto=format&fit=crop&w=1200&h=800',
    category: 'UPVC',
    subcategory: 'Doors',
    material: 'UPVC',
    size: '72" x 80"',
    inStock: true,
    featured: true
  },
  {
    id: '3',
    name: 'Aluminium Casement Window',
    description: 'Durable aluminium frame with smooth operation',
    price: 34500,
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?auto=format&fit=crop&w=1200&h=800',
    category: 'Aluminium',
    subcategory: 'Windows',
    material: 'Aluminium',
    size: '36" x 48"',
    inStock: true,
    featured: false
  },
  {
    id: '4',
    name: 'Steel Security Door',
    description: 'Heavy-duty steel door for maximum security',
    price: 70000,
    image: 'https://images.unsplash.com/photo-1543420629-5350879dd4cd?auto=format&fit=crop&w=1200&h=800',
    category: 'Steel',
    subcategory: 'Doors',
    material: 'Steel',
    size: '36" x 80"',
    inStock: true,
    featured: true
  },
  {
    id: '5',
    name: 'Glass Partition',
    description: 'Modern glass partition for office spaces',
    price: 98500,
    image: 'https://images.unsplash.com/photo-1620332372374-f108c53f2c06?auto=format&fit=crop&w=1200&h=800',
    category: 'Glass',
    subcategory: 'Partitions',
    material: 'Tempered Glass',
    size: '96" x 80"',
    inStock: true,
    featured: false
  },
  {
    id: '6',
    name: 'Iron Main Gate',
    description: 'Ornate iron main gate with durable powder coating',
    price: 148000,
    image: 'https://images.unsplash.com/photo-1507637246190-63d5daf6d9e1?auto=format&fit=crop&w=1200&h=800',
    category: 'Iron',
    subcategory: 'Main gate',
    material: 'Iron',
    size: '12ft x 6ft',
    inStock: true,
    featured: true
  },
  {
    id: '7',
    name: 'WPVC Interior Door',
    description: 'Stylish and durable interior door',
    price: 26000,
    image: 'https://images.unsplash.com/photo-1550705591-932d2878b6ee?auto=format&fit=crop&w=1200&h=800',
    category: 'WPVC',
    subcategory: 'Doors',
    material: 'WPVC',
    size: '32" x 80"',
    inStock: true,
    featured: false
  },
  {
    id: '8',
    name: 'ABS Bathroom Door',
    description: 'Water-resistant ABS door perfect for bathrooms',
    price: 23000,
    image: 'https://images.unsplash.com/photo-1596416827954-fe736e2a271e?auto=format&fit=crop&w=1200&h=800',
    category: 'ABS',
    subcategory: 'Doors',
    material: 'ABS Plastic',
    size: '30" x 78"',
    inStock: true,
    featured: false
  }
];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load products from localStorage or use initial data
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, []);

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    };
    
    const updatedProducts = [...products, newProduct];
    saveProducts(updatedProducts);
    
    toast({
      title: "Product Added",
      description: `${product.name} has been added successfully`,
    });
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    const updatedProducts = products.map(product => 
      product.id === id ? { ...product, ...updatedFields } : product
    );
    
    saveProducts(updatedProducts);
    
    toast({
      title: "Product Updated",
      description: "The product has been updated successfully",
    });
  };

  const deleteProduct = (id: string) => {
    const productToDelete = products.find(product => product.id === id);
    const updatedProducts = products.filter(product => product.id !== id);
    
    saveProducts(updatedProducts);
    
    toast({
      title: "Product Deleted",
      description: productToDelete 
        ? `${productToDelete.name} has been deleted` 
        : "The product has been deleted",
    });
  };

  const getProductsByCategory = (category: ProductCategory) => {
    return products.filter(product => product.category === category);
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured);
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      addProduct, 
      updateProduct, 
      deleteProduct,
      getProductsByCategory,
      getFeaturedProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
