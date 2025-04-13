import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "@/contexts/ProductContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Home, ChevronRight, ShoppingCart, Edit, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products, deleteProduct } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === productId);
  
  const [mainImage, setMainImage] = useState(product?.image || "/placeholder.svg");
  
  const generateGalleryImages = (mainImg: string) => {
    return [
      mainImg,
      mainImg + "?v=1",
      mainImg + "?v=2",
      mainImg + "?v=3"
    ];
  };
  
  const galleryImages = product ? generateGalleryImages(product.image) : ["/placeholder.svg"];
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (product) {
      setMainImage(product.image);
    }
  }, [productId, product]);
  
  const handleDeleteProduct = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId!);
      toast({
        title: "Product Deleted",
        description: "The product has been successfully deleted."
      });
      navigate("/");
    }
  };
  
  if (!product) {
    return (
      <div>
        <NavBar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4 mr-1" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${product.category.toLowerCase()}`}>
                {product.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <AnimatedSection animation="fade-in-left">
            <div className="space-y-4">
              <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-gray-100">
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {galleryImages.map((image, index) => (
                  <div 
                    key={index}
                    className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden cursor-pointer border-2 ${mainImage === image ? 'border-primary' : 'border-transparent hover:border-primary'} transition-colors`}
                    onClick={() => setMainImage(image)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-in-right">
            <div className="space-y-6">
              {user?.isAdmin && (
                <div className="flex gap-2 mb-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Product
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleDeleteProduct}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Product
                  </Button>
                </div>
              )}
              
              <h1 className="text-3xl font-bold">{product.name}</h1>
              
              <div className="flex items-center">
                <span className="text-2xl font-bold">₹{product.price.toLocaleString()}</span>
                {product.inStock ? (
                  <span className="ml-4 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                    In Stock
                  </span>
                ) : (
                  <span className="ml-4 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                    Out of Stock
                  </span>
                )}
              </div>
              
              <div className="border-t border-b py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p>{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Subcategory</p>
                    <p>{product.subcategory}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Material</p>
                    <p>{product.material}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p>{product.size}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              <Button className="w-full" size="lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              
              <div className="text-sm text-gray-500 mt-4">
                <p>• Free delivery on orders over $500</p>
                <p>• 30-day returns policy</p>
                <p>• 2-year warranty on all products</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductPage;
