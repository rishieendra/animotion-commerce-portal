
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  useProducts, 
  Product, 
  ProductCategory, 
  ProductSubcategory 
} from "@/contexts/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";

// Define the category to subcategory mapping
const categorySubcategoryMap: Record<ProductCategory, ProductSubcategory[]> = {
  'UPVC': ['Windows', 'Doors', 'Ventilators', 'Partitions'],
  'Aluminium': ['Windows', 'Doors'],
  'Steel': ['Windows', 'Doors', 'Grill', 'Railings'],
  'Glass': ['Partitions', 'Doors'],
  'Iron': ['Main gate', 'Windows', 'Doors', 'Grill'],
  'WPVC': ['Doors'],
  'ABS': ['Doors']
};

// All available categories
const allCategories: ProductCategory[] = [
  'UPVC', 'Aluminium', 'Steel', 'Glass', 'Iron', 'WPVC', 'ABS'
];

const ProductForm = () => {
  const { user } = useAuth();
  const { addProduct, updateProduct, products } = useProducts();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  
  const isEditMode = Boolean(productId);
  const productToEdit = isEditMode 
    ? products.find(p => p.id === productId) 
    : null;

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    image: '/placeholder.svg',
    category: 'UPVC',
    subcategory: 'Windows',
    material: '',
    size: '',
    inStock: true,
    featured: false
  });

  const [availableSubcategories, setAvailableSubcategories] = useState<ProductSubcategory[]>(
    categorySubcategoryMap[formData.category]
  );

  // Protect admin route
  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Initialize form with existing product data if in edit mode
  useEffect(() => {
    if (isEditMode && productToEdit) {
      setFormData(productToEdit);
      setAvailableSubcategories(categorySubcategoryMap[productToEdit.category]);
    }
  }, [isEditMode, productToEdit]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Update available subcategories when category changes
    if (field === 'category') {
      const newCategory = value as ProductCategory;
      const newSubcategories = categorySubcategoryMap[newCategory];
      setAvailableSubcategories(newSubcategories);
      
      // Auto-select first subcategory if current selection isn't valid
      if (!newSubcategories.includes(formData.subcategory)) {
        setFormData(prev => ({
          ...prev,
          subcategory: newSubcategories[0]
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && productId) {
      updateProduct(productId, formData);
      toast({
        title: "Product Updated",
        description: `${formData.name} has been updated successfully.`
      });
    } else {
      addProduct(formData);
      toast({
        title: "Product Added",
        description: `${formData.name} has been added successfully.`
      });
    }

    navigate("/admin");
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div>
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate("/admin")} 
          className="mb-6"
        >
          Back to Dashboard
        </Button>
        
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</CardTitle>
            <CardDescription>
              {isEditMode 
                ? 'Update the product information below' 
                : 'Fill in the product details to add it to your inventory'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {allCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select
                      value={formData.subcategory}
                      onValueChange={(value) => handleChange('subcategory', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubcategories.map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {subcategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      value={formData.material}
                      onChange={(e) => handleChange('material', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      value={formData.size}
                      onChange={(e) => handleChange('size', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => handleChange('image', e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Using placeholder for demo. In a real app, you would upload an image.
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-8">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inStock"
                      checked={formData.inStock}
                      onCheckedChange={(checked) => 
                        handleChange('inStock', checked === true)
                      }
                    />
                    <Label htmlFor="inStock">In Stock</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => 
                        handleChange('featured', checked === true)
                      }
                    />
                    <Label htmlFor="featured">Featured Product</Label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button type="submit" className="w-full">
                  {isEditMode ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductForm;
