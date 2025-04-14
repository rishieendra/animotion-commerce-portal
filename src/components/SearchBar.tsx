
import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { useProducts, Product } from "@/contexts/ProductContext";

const SearchBar = () => {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const commandRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = products.filter(product => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.subcategory.toLowerCase().includes(query) ||
        product.material.toLowerCase().includes(query)
      );
    });

    // Sort results by relevance (exact name match first, then category, etc.)
    results.sort((a, b) => {
      // Exact name match gets highest priority
      const aNameMatch = a.name.toLowerCase().includes(query);
      const bNameMatch = b.name.toLowerCase().includes(query);
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      
      // Then category match
      const aCategoryMatch = a.category.toLowerCase() === query;
      const bCategoryMatch = b.category.toLowerCase() === query;
      if (aCategoryMatch && !bCategoryMatch) return -1;
      if (!aCategoryMatch && bCategoryMatch) return 1;
      
      return 0;
    });

    setSearchResults(results);
  }, [searchQuery, products]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() !== "") {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleSelectProduct = (product: Product) => {
    navigate(`/product/${product.id}`);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search products, categories..."
          className="pr-10 bg-white/90 text-gray-900"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => searchQuery.trim() !== "" && setIsOpen(true)}
        />
        {searchQuery ? (
          <button 
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        ) : (
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
        )}
      </div>

      {isOpen && (
        <div 
          ref={commandRef}
          className="absolute mt-1 w-full z-50"
        >
          <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="Search products..." value={searchQuery} onValueChange={setSearchQuery} className="hidden" />
            <CommandList>
              <CommandEmpty>No results found</CommandEmpty>
              <CommandGroup heading="Products">
                {searchResults.slice(0, 6).map((product) => (
                  <CommandItem 
                    key={product.id} 
                    onSelect={() => handleSelectProduct(product)}
                    className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-sm text-gray-500">
                        {product.category} | ₹{product.price.toLocaleString()}
                      </span>
                    </div>
                  </CommandItem>
                ))}
                {searchResults.length > 6 && (
                  <div className="px-4 py-2 text-center text-sm text-gray-500">
                    + {searchResults.length - 6} more results
                  </div>
                )}
              </CommandGroup>
              {searchResults.length > 0 && (
                <div className="p-2 text-center">
                  <button 
                    onClick={() => navigate(`/search?q=${encodeURIComponent(searchQuery)}`)}
                    className="text-sm text-primary hover:underline"
                  >
                    View all results
                  </button>
                </div>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
