
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
import { CreditCard, Landmark, MapPin, QrCode, Wallet, CheckCircle, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  fullName: z.string().min(3, { message: 'Full name is required' }),
  phoneNumber: z.string().min(10, { message: 'Valid phone number is required' }),
  address: z.string().min(10, { message: 'Complete address is required' }),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State is required' }),
  pincode: z.string().min(6, { message: 'Valid pincode is required' }),
  paymentMethod: z.enum(['credit-card', 'upi', 'cod', 'netbanking']),
  // Additional fields for credit card
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  // Additional fields for UPI
  upiId: z.string().optional(),
  // Additional fields for netbanking
  bankName: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CheckoutPage = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<'address' | 'payment' | 'processing'>('address');
  const [processingStatus, setProcessingStatus] = useState<'processing' | 'success' | 'error'>('processing');
  
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

  // Calculate taxes, shipping, and total
  const subtotal = getTotalPrice();
  const taxes = Math.round(subtotal * 0.18);
  const shipping = subtotal > 5000 ? 0 : 299;
  const total = subtotal + taxes + shipping;

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

  const simulatePaymentProcessing = (data: FormValues) => {
    setStep('processing');
    setProcessingStatus('processing');
    
    // Simulate payment processing with a delay
    setTimeout(() => {
      // 95% chance of success (in a real app, this would be an actual payment gateway response)
      const isSuccess = Math.random() < 0.95;
      
      if (isSuccess) {
        setProcessingStatus('success');
        
        // Create order object
        const orderDate = new Date().toISOString().split('T')[0];
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        
        const newOrder = {
          id: orderId,
          date: orderDate,
          total: total,
          status: 'Processing',
          items: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          shippingAddress: {
            fullName: data.fullName,
            address: data.address,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            phoneNumber: data.phoneNumber
          },
          paymentMethod: data.paymentMethod
        };
        
        // Save to localStorage
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = [newOrder, ...existingOrders];
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        
        // Show success message and redirect after a delay
        setTimeout(() => {
          toast({
            title: "Order Placed Successfully!",
            description: `Your order total of ₹${total.toLocaleString()} has been placed successfully.`,
          });
          clearCart();
          navigate('/orders');
        }, 1500);
      } else {
        setProcessingStatus('error');
        // Show error message and allow retry
        setTimeout(() => {
          toast({
            title: "Payment Failed",
            description: "There was an issue processing your payment. Please try again.",
            variant: "destructive"
          });
          setStep('payment');
        }, 1500);
      }
    }, 3000);
  };

  const onSubmit = (data: FormValues) => {
    if (step === 'address') {
      setStep('payment');
      return;
    }
    
    // Process payment
    simulatePaymentProcessing(data);
  };

  // Conditionally render payment method specific fields
  const renderPaymentMethodFields = () => {
    const paymentMethod = form.watch('paymentMethod');
    
    switch (paymentMethod) {
      case 'credit-card':
        return (
          <div className="space-y-4 mt-4 p-4 border rounded-lg">
            <div className="grid grid-cols-1 gap-4">
              <FormItem>
                <FormLabel>Card Number</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="4242 4242 4242 4242" 
                    onChange={(e) => form.setValue('cardNumber', e.target.value)}
                  />
                </FormControl>
              </FormItem>
              
              <div className="grid grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="MM/YY" 
                      onChange={(e) => form.setValue('cardExpiry', e.target.value)}
                    />
                  </FormControl>
                </FormItem>
                
                <FormItem>
                  <FormLabel>CVV</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123" 
                      type="password"
                      maxLength={3}
                      onChange={(e) => form.setValue('cardCvv', e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              </div>
            </div>
          </div>
        );
      
      case 'upi':
        return (
          <div className="space-y-4 mt-4 p-4 border rounded-lg">
            <FormItem>
              <FormLabel>UPI ID</FormLabel>
              <FormControl>
                <Input 
                  placeholder="username@upi" 
                  onChange={(e) => form.setValue('upiId', e.target.value)}
                />
              </FormControl>
            </FormItem>
          </div>
        );
      
      case 'netbanking':
        return (
          <div className="space-y-4 mt-4 p-4 border rounded-lg">
            <FormItem>
              <FormLabel>Select Bank</FormLabel>
              <Select 
                onValueChange={(value) => form.setValue('bankName', value)}
                defaultValue=""
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your bank" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sbi">State Bank of India</SelectItem>
                  <SelectItem value="hdfc">HDFC Bank</SelectItem>
                  <SelectItem value="icici">ICICI Bank</SelectItem>
                  <SelectItem value="axis">Axis Bank</SelectItem>
                  <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Render processing screen
  if (step === 'processing') {
    return (
      <div>
        <NavBar />
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <div className="max-w-md w-full p-8 border rounded-lg bg-white shadow-md">
            {processingStatus === 'processing' && (
              <>
                <div className="flex justify-center mb-4">
                  <Loader2 className="h-16 w-16 text-primary animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">Processing Payment</h2>
                <p className="text-center text-gray-500">Please wait while we process your payment...</p>
              </>
            )}
            
            {processingStatus === 'success' && (
              <>
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">Payment Successful!</h2>
                <p className="text-center text-gray-500">Your order has been placed successfully.</p>
              </>
            )}
            
            {processingStatus === 'error' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-500 text-3xl">×</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">Payment Failed</h2>
                <p className="text-center text-gray-500">There was an issue processing your payment.</p>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
                    
                    {renderPaymentMethodFields()}
                    
                    <div className="flex gap-4 mt-6">
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
              
              <ScrollArea className="max-h-80 mb-4">
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
              </ScrollArea>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>₹{taxes.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 font-bold flex justify-between">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
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
