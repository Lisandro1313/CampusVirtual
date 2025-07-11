import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle, Users } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', type: 'general' });
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email',
      details: 'esc.sup.paradocentes@gmail.com',
      description: 'Respuesta en 24 horas'
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Teléfono',
      details: '1121673242',
      description: 'Lun - Vie, 9:00 - 18:00'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Oficina',
      details: 'Punta Lara, Argentina',
      description: 'Calle 102 n 735'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Horarios',
      details: 'Lunes a Viernes',
      description: '9:00 AM - 6:00 PM (ART)'
    }
  ];

  const contactTypes = [
    {
      value: 'general',
      label: 'Consulta General',
      icon: <MessageCircle className="h-5 w-5" />
    },
    {
      value: 'support',
      label: 'Soporte Técnico',
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      value: 'instructor',
      label: 'Ser Instructor',
      icon: <Users className="h-5 w-5" />
    },
    {
      value: 'business',
      label: 'Empresas',
      icon: <Mail className="h-5 w-5" />
    }
  ];

  const faqs = [
    {
      question: '¿Cómo puedo acceder a mis cursos?',
      answer: 'Una vez que te registres y compres un curso, podrás acceder desde tu dashboard personal las 24 horas del día.'
    },
    {
      question: '¿Los certificados son reconocidos?',
      answer: 'Sí, nuestros certificados son reconocidos por empresas líderes en la industria y pueden agregarse a tu perfil de LinkedIn.'
    },
    {
      question: '¿Puedo obtener un reembolso?',
      answer: 'Ofrecemos una garantía de 30 días. Si no estás satisfecho con tu curso, puedes solicitar un reembolso completo.'
    },
    {
      question: '¿Cómo puedo convertirme en instructor?',
      answer: 'Puedes aplicar para ser instructor completando nuestro formulario de aplicación. Evaluamos cada solicitud cuidadosamente.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              ¿Necesitas Ayuda?
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-900 font-medium mb-1">{info.details}</p>
                <p className="text-gray-600 text-sm">{info.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un Mensaje</h2>
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Mensaje Enviado!</h3>
                  <p className="text-gray-600">Te responderemos dentro de las próximas 24 horas.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tipo de Consulta
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {contactTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                          className={`p-3 rounded-lg border-2 transition-all flex items-center space-x-2 ${
                            formData.type === type.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {type.icon}
                          <span className="text-sm font-medium">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asunto
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="¿En qué podemos ayudarte?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensaje
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe tu consulta en detalle..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Enviar Mensaje
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>

              {/* Additional Help */}
              <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">¿No encuentras lo que buscas?</h3>
                <p className="text-blue-800 mb-4">
                  Visita nuestro centro de ayuda completo o programa una llamada con nuestro equipo de soporte.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Centro de Ayuda
                  </button>
                  <button className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  <p className="text-gray-600">Calle 102 n 735, Punta Lara</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Ubicación</h2>
            <p className="text-gray-600">Visítanos en nuestras oficinas en Punta Lara</p>
          </div>
          
          <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Mapa Interactivo</h3>
              <p className="text-gray-600">Av. Corrientes 1234, CABA, Buenos Aires</p>
              <p className="text-gray-600">Argentina</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};