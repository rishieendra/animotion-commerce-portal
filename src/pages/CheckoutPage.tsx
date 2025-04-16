
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/components/ui/use-toast';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreditCard, Landmark, MapPin, QrCode, Wallet } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(3, { message: 'Full name is required' }),
  phoneNumber: z.string().min(10, { message: 'Valid phone number is required' }),
  address: z.string().min(10, { message: 'Complete address is required' }),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State is required' }),
  pincode: z.string().min(6, { message: 'Valid pincode is required' }),
  paymentMethod: z.enum(['credit-card', 'upi', 'cod', 'netbanking']),
});

type FormValues = z.infer<typeof formSchema>;

const CheckoutPage = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<'address' | 'payment'>('address');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      paymentMethod: 'credit-card',
    },
  });

  if (cartItems.length === 0) {
    return (
      <div>
        <NavBar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <Button onClick={() => navigate('/')}>Continue Shopping</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const onSubmit = (data: FormValues) => {
    if (step === 'address') {
      setStep('payment');
      return;
    }

    // Process payment and place order
    console.log('Order placed:', { ...data, items: cartItems, total: getTotalPrice() });
    
    // Simulate successful order placement
    toast({
      title: "Order Placed Successfully!",
      description: `Your order total of ₹${getTotalPrice().toLocaleString()} has been placed successfully.`,
    });
    
    clearCart();
    navigate('/orders');
  };

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex space-x-4">
                <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step === 'address' ? 'bg-primary text-white' : 'bg-primary/20 text-primary'}`}>
                  1
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold">Shipping Information</h2>
                  <p className="text-sm text-gray-600">Enter your shipping details</p>
                </div>
                <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step === 'payment' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold">Payment Method</h2>
                  <p className="text-sm text-gray-600">Select your payment method</p>
                </div>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 'address' ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="9876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="123 Main St, Apartment 4B" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Mumbai" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select State" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                                <SelectItem value="delhi">Delhi</SelectItem>
                                <SelectItem value="karnataka">Karnataka</SelectItem>
                                <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                                <SelectItem value="telangana">Telangana</SelectItem>
                                <SelectItem value="gujarat">Gujarat</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode</FormLabel>
                            <FormControl>
                              <Input placeholder="400001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">Continue to Payment</Button>
                  </>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Payment Method</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3"
                            >
                              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                                <RadioGroupItem value="credit-card" id="card" />
                                <CreditCard className="ml-2 h-5 w-5 text-primary" />
                                <label htmlFor="card" className="cursor-pointer flex-1 font-medium">Credit / Debit Card</label>
                              </div>
                              
                              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                                <RadioGroupItem value="upi" id="upi" />
                                <QrCode className="ml-2 h-5 w-5 text-primary" />
                                <label htmlFor="upi" className="cursor-pointer flex-1 font-medium">UPI Payment</label>
                              </div>
                              
                              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                                <RadioGroupItem value="netbanking" id="netbanking" />
                                <Landmark className="ml-2 h-5 w-5 text-primary" />
                                <label htmlFor="netbanking" className="cursor-pointer flex-1 font-medium">Net Banking</label>
                              </div>
                              
                              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                                <RadioGroupItem value="cod" id="cod" />
                                <Wallet className="ml-2 h-5 w-5 text-primary" />
                                <label htmlFor="cod" className="cursor-pointer flex-1 font-medium">Cash on Delivery</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex gap-4">
                      <Button variant="outline" type="button" className="flex-1" onClick={() => setStep('address')}>
                        Back
                      </Button>
                      <Button type="submit" className="flex-1">Place Order</Button>
                    </div>
                  </>
                )}
              </form>
            </Form>
          </div>
          
          <div className="md:w-1/3">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="max-h-80 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 py-3 border-b">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-bold">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{Math.round(getTotalPrice() * 0.18).toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 font-bold flex justify-between">
                  <span>Total</span>
                  <span>₹{(getTotalPrice() + Math.round(getTotalPrice() * 0.18)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
