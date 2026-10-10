import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [tableNumber, setTableNumberState] = useState(() => {
    return localStorage.getItem('hotel_table_number') || '1';
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('hotel_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customerInfo, setCustomerInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('hotel_customer');
      return saved ? JSON.parse(saved) : { name: '', phone: '', notes: '' };
    } catch {
      return { name: '', phone: '', notes: '' };
    }
  });

  const [activeOrder, setActiveOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('hotel_active_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('hotel_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('hotel_customer', JSON.stringify(customerInfo));
  }, [customerInfo]);

  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('hotel_active_order', JSON.stringify(activeOrder));
    } else {
      localStorage.removeItem('hotel_active_order');
    }
  }, [activeOrder]);

  const setTableNumber = (num) => {
    const tableStr = String(num);
    setTableNumberState(tableStr);
    localStorage.setItem('hotel_table_number', tableStr);
  };

  const addToCart = (item, instructions = '') => {
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.id === item.id);
      if (existing) {
        return prevCart.map((ci) =>
          ci.id === item.id
            ? { ...ci, quantity: ci.quantity + 1, special_instructions: instructions || ci.special_instructions }
            : ci
        );
      }
      return [
        ...prevCart,
        {
          id: item.id,
          name: item.name,
          price: Number(item.price),
          image_url: item.image_url,
          is_veg: item.is_veg,
          category: item.category,
          quantity: 1,
          special_instructions: instructions || ''
        }
      ];
    });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const updateInstructions = (itemId, instructions) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, special_instructions: instructions } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
  const totalAmount = subtotal + tax;
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = async () => {
    if (cart.length === 0) throw new Error('Cart is empty');
    const orderPayload = {
      table_number: Number(tableNumber),
      table_id: Number(tableNumber),
      customer_name: customerInfo.name || `Guest (Table ${tableNumber})`,
      customer_phone: customerInfo.phone || '',
      notes: customerInfo.notes || '',
      items: cart.map((i) => ({
        menu_item_id: i.id,
        item_name: i.name,
        price: i.price,
        quantity: i.quantity,
        special_instructions: i.special_instructions || ''
      })),
      total_amount: totalAmount
    };

    const created = await api.createOrder(orderPayload);
    setActiveOrder(created);
    clearCart();
    return created;
  };

  return (
    <CartContext.Provider
      value={{
        tableNumber,
        setTableNumber,
        cart,
        customerInfo,
        setCustomerInfo,
        addToCart,
        updateQuantity,
        updateInstructions,
        removeFromCart,
        clearCart,
        subtotal,
        tax,
        totalAmount,
        totalItemsCount,
        activeOrder,
        setActiveOrder,
        placeOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
