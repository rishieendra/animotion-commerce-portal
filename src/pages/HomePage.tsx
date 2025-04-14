
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts, ProductCategory } from "@/contexts/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ChevronRight, Search, Mail, MapPin, Phone } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pr-10 bg-white/90 text-gray-900"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>
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
            <h2 className="text-3xl font-bold mb-4">About Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Learn more about our commitment to quality and excellence
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection delay={100}>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&h=600" 
                  alt="Our workshop" 
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Our Story</h3>
                <p className="text-gray-600">
                  Founded in 1995, ArchitecturaPro has been at the forefront of architectural innovations for over two decades. What began as a small family business has grown into one of the most trusted names in premium architectural elements.
                </p>
                <p className="text-gray-600">
                  Our team of skilled craftsmen and designers blend traditional techniques with cutting-edge technology to create windows, doors, and partitions that stand the test of time. We take pride in sourcing only the highest quality materials to ensure durability, functionality, and aesthetic appeal.
                </p>
                <p className="text-gray-600">
                  At ArchitecturaPro, we believe that architectural elements are not just functional components but essential design features that transform spaces. Our commitment to excellence and attention to detail have earned us the trust of homeowners, architects, and builders nationwide.
                </p>
                <div className="pt-4">
                  <h4 className="font-bold text-lg mb-2">Our Values</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <li className="flex items-center text-gray-600">
                      <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Quality Craftsmanship
                    </li>
                    <li className="flex items-center text-gray-600">
                      <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Innovation
                    </li>
                    <li className="flex items-center text-gray-600">
                      <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Sustainability
                    </li>
                    <li className="flex items-center text-gray-600">
                      <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Customer Satisfaction
                    </li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get in touch with our team for personalized assistance and information
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedSection delay={100}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Visit Our Showroom</h3>
                <address className="not-italic text-gray-600">
                  <p>123 Architecture Avenue</p>
                  <p>Building District, BL 54321</p>
                  <p className="mt-2">Mon-Sat: 9:00 AM - 6:00 PM</p>
                  <p>Sunday: Closed</p>
                </address>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p className="text-gray-600 mb-2">Sales Department</p>
                <p className="text-primary font-semibold">+1 (555) 123-4567</p>
                <p className="text-gray-600 mt-4 mb-2">Customer Support</p>
                <p className="text-primary font-semibold">+1 (555) 765-4321</p>
                <p className="mt-4 text-gray-600">We're available 24/7 for urgent inquiries</p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={300}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <p className="text-gray-600 mb-2">General Inquiries</p>
                <p className="text-primary font-semibold mb-4">info@architecturapro.com</p>
                <p className="text-gray-600 mb-2">Sales & Quotations</p>
                <p className="text-primary font-semibold mb-4">sales@architecturapro.com</p>
                <p className="text-gray-600 mb-2">Support</p>
                <p className="text-primary font-semibold">support@architecturapro.com</p>
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
