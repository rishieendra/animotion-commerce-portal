
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Calendar, Truck, CheckCircle, Clock, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

// Define the order type
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);
  
  // Helper to format the payment method display
  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case 'credit-card':
        return 'Credit/Debit Card';
      case 'upi':
        return 'UPI Payment';
      case 'netbanking':
        return 'Net Banking';
      case 'cod':
        return 'Cash on Delivery';
      default:
        return method;
    }
  };
  
  // Helper to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Helper to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'Processing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };
  
  // Toggle order details expansion
  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  
  // Format date for better display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Get estimated delivery date (7 days from order date)
  const getEstimatedDelivery = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (orders.length === 0) {
    return (
      <div>
        <NavBar />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders.</p>
          <Button onClick={() => navigate('/')}>Start Shopping</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden shadow-sm">
              {/* Order Header */}
              <div className="bg-gray-50 p-4 flex flex-wrap items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-gray-600" />
                    <h2 className="font-semibold">Order #{order.id}</h2>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Placed on {formatDate(order.date)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(order.status)} variant="outline">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </div>
                  </Badge>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleOrderExpansion(order.id)}
                    className="flex items-center"
                  >
                    {expandedOrder === order.id ? (
                      <>View less <ChevronUp className="ml-1 h-4 w-4" /></>
                    ) : (
                      <>View details <ChevronDown className="ml-1 h-4 w-4" /></>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Order Details (expandable) */}
              {expandedOrder === order.id && (
                <div className="p-4 border-t">
                  <ResizablePanelGroup direction="horizontal" className="min-h-[200px]">
                    <ResizablePanel defaultSize={60}>
                      <div className="h-full p-4">
                        <h3 className="font-semibold mb-4">Order Items</h3>
                        <ScrollArea className="h-[250px]">
                          <div className="space-y-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between border-b pb-3">
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium">₹{item.price.toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        
                        <div className="mt-4 border-t pt-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span>₹{order.total.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>₹{order.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </ResizablePanel>
                    
                    <ResizableHandle withHandle />
                    
                    <ResizablePanel defaultSize={40}>
                      <div className="h-full p-4">
                        <div className="mb-6">
                          <h3 className="font-semibold mb-2">Shipping Address</h3>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="font-medium">{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                            <p>Phone: {order.shippingAddress.phoneNumber}</p>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <h3 className="font-semibold mb-2">Payment Method</h3>
                          <p className="bg-gray-50 p-3 rounded">{formatPaymentMethod(order.paymentMethod)}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-2">Delivery Information</h3>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="flex items-center mb-2">
                              <Truck className="h-4 w-4 mr-2" />
                              <span>Estimated delivery: {getEstimatedDelivery(order.date)}</span>
                            </p>
                            
                            <div className="relative mt-6 ml-2">
                              <div className="absolute left-2 top-0 h-full w-0.5 bg-gray-200"></div>
                              
                              <div className="relative flex items-center mb-6 pl-6">
                                <div className="absolute left-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                <div>
                                  <p className="font-medium">Order Placed</p>
                                  <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                                </div>
                              </div>
                              
                              <div className="relative flex items-center mb-6 pl-6">
                                <div className={`absolute left-0 w-4 h-4 rounded-full border-2 border-white ${order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <div>
                                  <p className="font-medium">Processing</p>
                                  <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                                </div>
                              </div>
                              
                              <div className="relative flex items-center mb-6 pl-6">
                                <div className={`absolute left-0 w-4 h-4 rounded-full border-2 border-white ${order.status === 'Shipped' || order.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <div>
                                  <p className="font-medium">Shipped</p>
                                  <p className="text-sm text-gray-600">{order.status === 'Shipped' || order.status === 'Delivered' ? 'In transit' : 'Pending'}</p>
                                </div>
                              </div>
                              
                              <div className="relative flex items-center pl-6">
                                <div className={`absolute left-0 w-4 h-4 rounded-full border-2 border-white ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <div>
                                  <p className="font-medium">Delivered</p>
                                  <p className="text-sm text-gray-600">{order.status === 'Delivered' ? 'Completed' : 'Pending'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </div>
              )}
              
              {/* Order Summary (collapsed view) */}
              {expandedOrder !== order.id && (
                <div className="p-4 border-t">
                  <div className="flex flex-wrap gap-6 justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Items</h3>
                      <p className="mt-1">{order.items.length} item(s)</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Total</h3>
                      <p className="mt-1 font-bold">₹{order.total.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Shipping to</h3>
                      <p className="mt-1">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Delivery</h3>
                      <p className="mt-1">Expected: {getEstimatedDelivery(order.date)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;
