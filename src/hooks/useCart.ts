import { useLocalStorage } from './useLocalStorage';
import { Course } from '../types';
import { allCourses } from '../data/mockData';

export interface CartItem {
  courseId: string;
  addedAt: string;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('campus-cart', []);

  const addToCart = (courseId: string) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.courseId === courseId);
      if (exists) return prev;
      
      return [...prev, { courseId, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromCart = (courseId: string) => {
    setCartItems(prev => prev.filter(item => item.courseId !== courseId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (courseId: string) => {
    return cartItems.some(item => item.courseId === courseId);
  };

  const getCartCourses = (): Course[] => {
    return cartItems
      .map(item => allCourses.find(course => course.id === item.courseId))
      .filter(Boolean) as Course[];
  };

  const getTotalPrice = () => {
    return getCartCourses().reduce((total, course) => total + course.price, 0);
  };

  const getItemCount = () => cartItems.length;

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    getCartCourses,
    getTotalPrice,
    getItemCount,
  };
};