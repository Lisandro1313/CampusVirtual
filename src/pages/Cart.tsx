import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

export const Cart: React.FC = () => {
  const { getCartCourses, removeFromCart, getTotalPrice, getItemCount, clearCart } = useCart();
  const { auth } = useAuth();
  const cartCourses = getCartCourses();
  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    if (!auth.isAuthenticated) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }
    
    // For now, just show an alert
    alert('Funcionalidad de checkout será implementada próximamente');
  };

  if (cartCourses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8">
              Explora nuestros cursos y agrega los que te interesen
            </p>
            <Link
              to="/courses"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              Explorar Cursos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Carrito de Compras</h1>
            <p className="text-gray-600">{getItemCount()} curso{getItemCount() !== 1 ? 's' : ''} en tu carrito</p>
          </div>
          <Link
            to="/courses"
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Seguir Comprando
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-4">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {course.shortDescription}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Por {course.instructor}</span>
                      <span>•</span>
                      <span>{course.duration}</span>
                      <span>•</span>
                      <span>{course.lessons} lecciones</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      ${course.price}
                    </div>
                    {course.originalPrice && (
                      <div className="text-sm text-gray-400 line-through mb-2">
                        ${course.originalPrice}
                      </div>
                    )}
                    <button
                      onClick={() => removeFromCart(course.id)}
                      className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-medium flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Vaciar Carrito
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Resumen del Pedido</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Descuentos</span>
                  <span className="font-semibold text-green-600">-$0.00</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Proceder al Pago
              </button>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-2">¿Por qué elegir Campus Lisandro?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Acceso de por vida</li>
                  <li>• Certificados verificados</li>
                  <li>• Soporte 24/7</li>
                  <li>• Garantía de 30 días</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};