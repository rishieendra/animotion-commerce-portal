
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCategory } from "@/contexts/ProductContext";
import { useRef, useEffect } from "react";

interface CategoryCardProps {
  category: ProductCategory;
  image: string;
  count: number;
  index: number;
}

const CategoryCard = ({ category, image, count, index }: CategoryCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const animationDelay = index * 150;
    if (cardRef.current) {
      cardRef.current.style.animationDelay = `${animationDelay}ms`;
    }
  }, [index]);

  return (
    <div ref={cardRef} className="scroll-reveal">
      <Link to={`/category/${category.toLowerCase()}`}>
        <Card className="product-card overflow-hidden">
          <div className="relative overflow-hidden pb-[60%]">
            <img
              src={image}
              alt={category}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-xl font-bold">{category}</h3>
                <p className="text-sm">{count} Products</p>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default CategoryCard;
