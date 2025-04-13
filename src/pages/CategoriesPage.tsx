
import { useEffect } from "react";
import { useProducts, ProductCategory } from "@/contexts/ProductContext";
import CategoryCard from "@/components/CategoryCard";
import AnimatedSection from "@/components/AnimatedSection";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const CategoriesPage = () => {
  const { products } = useProducts();
  
  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<ProductCategory, typeof products>);
  
  // Get categories with at least one product
  const categories = Object.keys(productsByCategory).filter(
    category => productsByCategory[category as ProductCategory]?.length > 0
  ) as ProductCategory[];
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Add scroll animation observer for category cards
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
  }, []);

  return (
    <div>
      <NavBar />
      
      {/* Header */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h1 className="text-4xl font-bold mb-4">Product Categories</h1>
            <p className="text-gray-600">
              Browse our extensive collection of architectural elements
            </p>
          </AnimatedSection>
        </div>
      </section>
      
      {/* Categories Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CategoryCard 
                key={category} 
                category={category} 
                image="/placeholder.svg"
                count={productsByCategory[category].length} 
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Category Descriptions */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection className="mb-10">
            <h2 className="text-3xl font-bold mb-4">Our Product Lines</h2>
            <p className="text-gray-600">
              Learn more about our different product categories and find the perfect match for your needs
            </p>
          </AnimatedSection>
          
          <div className="space-y-12">
            <AnimatedSection>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3">
                  <div className="rounded-lg overflow-hidden">
                    <img src="/placeholder.svg" alt="UPVC" className="w-full h-auto" />
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-2xl font-bold mb-4">UPVC Windows and Doors</h3>
                  <p className="text-gray-700 mb-4">
                    Our UPVC windows and doors are known for their excellent thermal insulation, sound reduction, and low maintenance requirements. They are resistant to rotting, rusting, and corroding, making them perfect for any climate.
                  </p>
                  <p className="text-gray-700">
                    Available in a wide range of styles including casement, sliding, tilt and turn windows, and various door options to suit your architectural requirements.
                  </p>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection>
              <div className="flex flex-col md:flex-row-reverse gap-8">
                <div className="w-full md:w-1/3">
                  <div className="rounded-lg overflow-hidden">
                    <img src="/placeholder.svg" alt="Aluminium" className="w-full h-auto" />
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-2xl font-bold mb-4">Aluminium Windows and Doors</h3>
                  <p className="text-gray-700 mb-4">
                    Aluminium windows and doors offer sleek, contemporary aesthetics with superior strength and durability. Their slim profiles allow for larger glass areas, bringing more natural light into your space.
                  </p>
                  <p className="text-gray-700">
                    Highly customizable in terms of colors and finishes, our aluminium products are perfect for modern architectural designs.
                  </p>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3">
                  <div className="rounded-lg overflow-hidden">
                    <img src="/placeholder.svg" alt="Steel" className="w-full h-auto" />
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-2xl font-bold mb-4">Steel Windows, Doors, and Railings</h3>
                  <p className="text-gray-700 mb-4">
                    Steel elements combine industrial charm with unmatched strength and security. Our steel windows and doors feature narrow sightlines while providing maximum durability and longevity.
                  </p>
                  <p className="text-gray-700">
                    From classic steel windows to modern security doors and decorative railings, our steel products add character and safety to any building.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default CategoriesPage;
