
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProducts, ProductCategory } from "@/contexts/ProductContext";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { products } = useProducts();
  
  const category = categoryId?.toUpperCase() as ProductCategory;
  const categoryProducts = products.filter(product => 
    product.category.toLowerCase() === categoryId?.toLowerCase()
  );
  
  const subcategories = [...new Set(categoryProducts.map(product => product.subcategory))];
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Add scroll animation observer for product cards
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    scrollElements.forEach(el => observer.observe(el));
    
    return () => {
      scrollElements.forEach(el => observer.unobserve(el));
    };
  }, [categoryId]);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div>
      <NavBar />
      
      {/* Category Header */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h1 className="text-4xl font-bold mb-4">{category}</h1>
            <p className="text-gray-600">
              Browse our collection of {category} products
            </p>
          </AnimatedSection>
        </div>
      </section>
      
      {/* Subcategories */}
      {subcategories.map((subcategory) => {
        const subcategoryProducts = categoryProducts.filter(
          product => product.subcategory === subcategory
        );
        
        return (
          <section key={subcategory} className="py-12">
            <div className="container mx-auto px-4">
              <AnimatedSection className="mb-8">
                <h2 className="text-2xl font-bold">{subcategory}</h2>
              </AnimatedSection>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {subcategoryProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    index={index} 
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}
      
      {categoryProducts.length === 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
