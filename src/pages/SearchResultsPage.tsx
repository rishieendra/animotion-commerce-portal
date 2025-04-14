
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, Product } from "@/contexts/ProductContext";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { products } = useProducts();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: new Set<string>(),
    subcategories: new Set<string>(),
    priceRange: { min: 0, max: 200000 },
    inStock: false
  });

  const categories = [...new Set(products.map(p => p.category))];
  const subcategories = [...new Set(products.map(p => p.subcategory))];

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setFilteredResults([]);
      return;
    }

    console.log(`Search results page query: "${searchQuery}"`);
    
    const query = searchQuery.toLowerCase();
    const results = products.filter(product => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.subcategory.toLowerCase().includes(query) ||
        (product.subcategory.toLowerCase() === "doors" && query === "door") ||  // Match singular/plural variants
        product.material.toLowerCase().includes(query)
      );
    });

    console.log(`Found ${results.length} products matching "${query}"`);
    
    results.sort((a, b) => {
      // Exact name match gets highest priority
      const aNameMatch = a.name.toLowerCase().includes(query);
      const bNameMatch = b.name.toLowerCase().includes(query);
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      
      // Then category/subcategory match
      const aCategoryMatch = a.category.toLowerCase().includes(query) || a.subcategory.toLowerCase().includes(query);
      const bCategoryMatch = b.category.toLowerCase().includes(query) || b.subcategory.toLowerCase().includes(query);
      if (aCategoryMatch && !bCategoryMatch) return -1;
      if (!aCategoryMatch && bCategoryMatch) return 1;
      
      return 0;
    });

    setSearchResults(results);
    setFilteredResults(results);
  }, [searchQuery, products]);

  useEffect(() => {
    let filtered = [...searchResults];
    
    if (filters.categories.size > 0) {
      filtered = filtered.filter(p => filters.categories.has(p.category));
    }
    
    if (filters.subcategories.size > 0) {
      filtered = filtered.filter(p => filters.subcategories.has(p.subcategory));
    }
    
    filtered = filtered.filter(
      p => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
    );
    
    if (filters.inStock) {
      filtered = filtered.filter(p => p.inStock);
    }
    
    setFilteredResults(filtered);
  }, [filters, searchResults]);

  const toggleCategoryFilter = (category: string) => {
    const newCategories = new Set(filters.categories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setFilters({ ...filters, categories: newCategories });
  };

  const toggleSubcategoryFilter = (subcategory: string) => {
    const newSubcategories = new Set(filters.subcategories);
    if (newSubcategories.has(subcategory)) {
      newSubcategories.delete(subcategory);
    } else {
      newSubcategories.add(subcategory);
    }
    setFilters({ ...filters, subcategories: newSubcategories });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="max-w-md mx-auto w-full mb-6">
            <SearchBar />
          </div>
          
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Search Results for "{searchQuery}"
            </h1>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            {filteredResults.length} products found
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {showFilters && (
              <div className="lg:col-span-1 border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold flex items-center gap-2">
                    <Filter className="h-4 w-4" /> Filters
                  </h2>
                  <Button 
                    variant="ghost" 
                    className="text-sm h-auto p-0"
                    onClick={() => {
                      setFilters({
                        categories: new Set(),
                        subcategories: new Set(),
                        priceRange: { min: 0, max: 200000 },
                        inStock: false
                      });
                    }}
                  >
                    Clear all
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Categories</h3>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category}`} 
                            checked={filters.categories.has(category)}
                            onCheckedChange={() => toggleCategoryFilter(category)}
                          />
                          <Label 
                            htmlFor={`category-${category}`}
                            className="text-sm cursor-pointer"
                          >
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Types</h3>
                    <div className="space-y-2">
                      {subcategories.map(subcategory => (
                        <div key={subcategory} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`subcategory-${subcategory}`} 
                            checked={filters.subcategories.has(subcategory)}
                            onCheckedChange={() => toggleSubcategoryFilter(subcategory)}
                          />
                          <Label 
                            htmlFor={`subcategory-${subcategory}`}
                            className="text-sm cursor-pointer"
                          >
                            {subcategory}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Price Range</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">Min</label>
                        <Input 
                          type="number"
                          min="0"
                          value={filters.priceRange.min}
                          onChange={(e) => setFilters({
                            ...filters, 
                            priceRange: {
                              ...filters.priceRange,
                              min: Number(e.target.value)
                            }
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Max</label>
                        <Input 
                          type="number"
                          min="0"
                          value={filters.priceRange.max}
                          onChange={(e) => setFilters({
                            ...filters, 
                            priceRange: {
                              ...filters.priceRange,
                              max: Number(e.target.value)
                            }
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="in-stock" 
                        checked={filters.inStock}
                        onCheckedChange={(checked) => 
                          setFilters({...filters, inStock: checked === true})
                        }
                      />
                      <Label 
                        htmlFor="in-stock"
                        className="text-sm cursor-pointer"
                      >
                        In Stock Only
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
              {filteredResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResults.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      index={index} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No products found matching your criteria</p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setFilters({
                        categories: new Set(),
                        subcategories: new Set(),
                        priceRange: { min: 0, max: 200000 },
                        inStock: false
                      });
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResultsPage;
