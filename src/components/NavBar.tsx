
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Package, 
  Info, 
  Phone,
  ChevronDown,
  ShoppingBag
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/contexts/CartContext";

const NavBar = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            ArchitecturaPro
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/categories" className="hover:text-primary transition-colors">
              Categories
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:text-primary transition-colors flex items-center">
                About <ChevronDown className="h-4 w-4 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/about" className="flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium">Our Story</div>
                      <div className="text-xs text-muted-foreground">Learn about our history and values</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/showroom" className="flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium">Showroom</div>
                      <div className="text-xs text-muted-foreground">Visit our product displays</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:text-primary transition-colors flex items-center">
                Contact <ChevronDown className="h-4 w-4 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/contact" className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium">Get in Touch</div>
                      <div className="text-xs text-muted-foreground">Contact our sales team</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/support" className="flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium">Support</div>
                      <div className="text-xs text-muted-foreground">Get help with your products</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-4">
            {user?.isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="icon">
                  <Package className="h-5 w-5" />
                </Button>
              </Link>
            )}
            
            <Link to="/orders">
              <Button variant="outline" size="icon">
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </Link>
            
            <Link to="/cart">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile">
                  <Button variant="outline" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
