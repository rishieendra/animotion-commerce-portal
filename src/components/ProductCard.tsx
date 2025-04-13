
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/contexts/ProductContext";
import { useRef, useEffect } from "react";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const animationDelay = index * 100;
    if (cardRef.current) {
      cardRef.current.style.animationDelay = `${animationDelay}ms`;
    }
  }, [index]);

  return (
    <div ref={cardRef} className="scroll-reveal">
      <Link to={`/product/${product.id}`}>
        <Card className="product-card overflow-hidden h-full">
          <div className="relative overflow-hidden pb-[80%]">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-110"
            />
            {product.featured && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                Featured
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg truncate">{product.name}</h3>
            <div className="flex justify-between items-center mt-1">
              <div className="text-sm text-gray-500">
                {product.category} | {product.subcategory}
              </div>
              <div className="font-bold">${product.price}</div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 text-sm text-gray-500">
            {product.material} | {product.size}
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
};

export default ProductCard;
