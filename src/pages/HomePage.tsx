import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useProducts, ProductCategory } from "@/contexts/ProductContext";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";

const categoryImages: Record<ProductCategory, string> = {
  'UPVC': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&h=450',
  'Aluminium': 'https://images.unsplash.com/photo-1495841674384-a283dc3dfabb?auto=format&fit=crop&w=800&h=450',
  'Steel': 'https://images.unsplash.com/photo-1614735241165-6756e1df61ab?auto=format&fit=crop&w=800&h=450',
  'Glass': 'https://images.unsplash.com/photo-1597142078583-99a667029450?auto=format&fit=crop&w=800&h=450',
  'Iron': 'https://images.unsplash.com/photo-1473815579684-96f56188687c?auto=format&fit=crop&w=800&h=450',
  'WPVC': 'https://images.unsplash.com/photo-1581000360862-acdc8735c242?auto=format&fit=crop&w=800&h=450',
  'ABS': 'https://images.unsplash.com/photo-1558612123-f8eea59d6ff2?auto=format&fit=crop&w=800&h=450'
};

const HomePage = () => {
  const { products, getFeaturedProducts } = useProducts();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const featuredProducts = getFeaturedProducts();
  
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<ProductCategory, typeof products>);
  
  const categories = Object.keys(productsByCategory).filter(
    category => productsByCategory[category as ProductCategory]?.length > 0
  ) as ProductCategory[];
  
  useEffect(() => {
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
      
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-black/50 z-0">
          <img 
            src="https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1920&h=1080" 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-50 mix-blend-overlay"
          />
        </div>
        <div className="container mx-auto px-4 py-24 sm:py-32 relative z-10">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Premium Architectural Elements
            </h1>
            <p className="text-lg sm:text-xl mb-8">
              Transform your space with our high-quality windows, doors, and partitions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/categories">
                <Button size="lg" className="font-semibold">
                  Browse Categories
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="font-semibold">
                  Contact Us
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
      
      <section ref={scrollRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/categories" className="text-primary flex items-center hover:underline">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index} 
              />
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our extensive collection of architectural elements categorized for easy navigation
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <AnimatedSection key={category} delay={index * 100}>
                <Link to={`/category/${category.toLowerCase()}`} className="block group">
                  <div className="relative overflow-hidden rounded-lg shadow-md">
                    <div className="aspect-w-16 aspect-h-9">
                      <img 
                        src={categoryImages[category]} 
                        alt={category} 
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-white text-center">
                        <h3 className="text-2xl font-bold mb-2">{category}</h3>
                        <p>{productsByCategory[category].length} Products</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We pride ourselves on quality craftsmanship and exceptional service
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection delay={100}>
              <div className="text-center p-6 hover:shadow-lg transition-shadow rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                <p className="text-gray-600">
                  All our products are crafted with the finest materials for durability and longevity
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <div className="text-center p-6 hover:shadow-lg transition-shadow rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Installation</h3>
                <p className="text-gray-600">
                  Our team of professionals ensures perfect installation every time
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={300}>
              <div className="text-center p-6 hover:shadow-lg transition-shadow rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Customer Support</h3>
                <p className="text-gray-600">
                  Dedicated support team available to assist you at every step
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Space?</h2>
            <p className="text-lg mb-8">
              Contact our experts for personalized recommendations and quotes
            </p>
            <div className="flex justify-center">
              <Link to="/contact">
                <Button variant="secondary" size="lg">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HomePage;
