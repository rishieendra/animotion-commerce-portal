
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag } from 'lucide-react';

// Sample orders data - in a real app, this would come from a database
const sampleOrders = [
  {
    id: 'ORD-12345',
    date: '2025-04-15',
    total: 32999,
    status: 'Delivered',
    items: [
      { name: 'Modern Office Chair', quantity: 1, price: 12999 },
      { name: 'Minimalist Desk Lamp', quantity: 2, price: 9999 }
    ]
  },
  {
    id: 'ORD-67890',
    date: '2025-04-10',
    total: 45999,
    status: 'Processing',
    items: [
      { name: 'Wooden Coffee Table', quantity: 1, price: 25999 },
      { name: 'Decorative Wall Shelf', quantity: 1, price: 19999 }
    ]
  },
  {
    id: 'ORD-54321',
    date: '2025-04-05',
    total: 8999,
    status: 'Shipped',
    items: [
      { name: 'Ceramic Flower Vase', quantity: 1, price: 8999 }
    ]
  }
];

const OrdersPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

        {sampleOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders.</p>
            <Button onClick={() => navigate('/')}>Start Shopping</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {sampleOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-6">
                <div className="flex flex-wrap justify-between mb-4">
                  <div>
                    <h2 className="font-semibold">Order #{order.id}</h2>
                    <p className="text-sm text-gray-600">Placed on {order.date}</p>
                  </div>
                  <div className="flex items-center">
                    <span 
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'Shipped' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-b py-4 my-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between mt-4">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    <span className="text-sm">
                      {order.status === 'Delivered' 
                        ? 'Delivered on April 20, 2025' 
                        : order.status === 'Shipped' 
                        ? 'Expected delivery: April 22, 2025' 
                        : 'Processing your order'}
                    </span>
                  </div>
                  <p className="font-bold">Total: ₹{order.total.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;
