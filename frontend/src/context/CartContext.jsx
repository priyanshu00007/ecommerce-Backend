import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  function normalizeItem(i) {
    return {
      ...i,
      name: i.name || i.product_name || 'Product',
      price: i.price || i.product_price || 0,
      image_url: i.image_url || i.product_image || '/images/product.svg',
    };
  }

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); setCount(0); return; }
    try {
      setLoading(true);
      const { data } = await cartAPI.get();
      const mapped = (data || []).map(normalizeItem);
      setItems(mapped);
      setCount(mapped.reduce((s, i) => s + i.quantity, 0));
    } catch { setItems([]); setCount(0); }
    finally { setLoading(false); }
  }, [user]);

  const addItem = async (productId, quantity = 1) => {
    const { data } = await cartAPI.add({ product_id: productId, quantity });
    await fetchCart();
    return data;
  };

  const updateItem = async (id, quantity) => {
    await cartAPI.update(id, { quantity });
    await fetchCart();
  };

  const removeItem = async (id) => {
    await cartAPI.remove(id);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartAPI.clear();
    setItems([]);
    setCount(0);
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, subtotal, loading, fetchCart, addItem, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
