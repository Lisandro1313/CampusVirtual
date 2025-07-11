import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/src/assets/Imagen de WhatsApp 2025-07-10 a las 15.54.58_bc651df1.jpg" 
                alt="E.S.FD Logo" 
                className="h-8 w-8 rounded-lg object-cover"
              />
              <span className="text-2xl font-bold">E.S.FD</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Escuela Superior de Formación Docente. Educación de calidad para formar los docentes del futuro.
              Dirigida por Norma Skuletich, Magister en Educación.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Todos los Cursos
                </Link>
              </li>
              <li>
                <Link to="/teachers" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Conviértete en Instructor
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">esc.sup.paradocentes@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">1121673242</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">Calle 102 n 735, Punta Lara</span>
              </li>
              <li className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-blue-400" />
                <a href="http://www.horizontepedagogico.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition-colors">
                  www.horizontepedagogico.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 E.S.FD - Escuela Superior de Formación Docente. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Política de Privacidad
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Términos de Uso
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};