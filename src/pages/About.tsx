import React from 'react';
import { Users, Target, Award, Heart, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  const team = [
    {
      name: 'Norma Skuletich',
      role: 'Directora & Magister en Educación',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      bio: 'Magister en Educación con más de 15 años de experiencia en formación docente y gestión educativa.'
    },
    {
      name: 'Prof. Ana Martínez',
      role: 'Coordinadora Académica',
      image: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      bio: 'Especialista en desarrollo curricular y metodologías de enseñanza innovadoras.'
    },
    {
      name: 'Lic. Carlos Fernández',
      role: 'Coordinador de Tecnología Educativa',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      bio: 'Licenciado en Educación especializado en integración de tecnología en el aula.'
    },
    {
      name: 'Prof. Laura Gómez',
      role: 'Coordinadora de Prácticas',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      bio: 'Profesora especializada en acompañamiento de prácticas docentes y evaluación formativa.'
    }
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Excelencia Educativa',
      description: 'Nos comprometemos a ofrecer contenido de la más alta calidad, creado por expertos reconocidos en sus campos.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Comunidad Inclusiva',
      description: 'Creamos un ambiente de aprendizaje donde todos se sienten bienvenidos y pueden alcanzar su máximo potencial.'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Innovación Constante',
      description: 'Utilizamos las últimas tecnologías y metodologías para mejorar continuamente la experiencia de aprendizaje.'
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Pasión por Enseñar',
      description: 'Cada miembro de nuestro equipo comparte la pasión por la educación y el desarrollo personal.'
    }
  ];

  const achievements = [
    { number: '500+', label: 'Docentes Formados' },
    { number: '25+', label: 'Cursos Especializados' },
    { number: '15+', label: 'Años de Experiencia' },
    { number: '98%', label: 'Tasa de Satisfacción' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Transformando el Futuro de la 
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Educación</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              En Campus Lisandro, creemos que la educación de calidad debe ser accesible para todos. 
              Nuestra misión es democratizar el aprendizaje y empoderar a las personas para que alcancen sus metas profesionales.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Nuestra Misión</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Brindar formación docente de excelencia que prepare a los educadores para los desafíos 
                del siglo XXI. Nos enfocamos en metodologías innovadoras, tecnología educativa y 
                desarrollo integral del docente como agente de cambio social.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Formación docente de calidad</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Metodologías pedagógicas innovadoras</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Certificaciones oficiales reconocidas</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2"
                alt="Estudiantes aprendiendo"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-blue-600">2019</div>
                <div className="text-gray-600">Fundación E.S.FD</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Los principios que guían cada decisión y acción en Campus Lisandro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nuestros Logros</h2>
            <p className="text-xl text-blue-100">
              Números que reflejan nuestro compromiso con la excelencia educativa
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">{achievement.number}</div>
                <div className="text-blue-100">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestro Equipo</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conoce a las personas apasionadas que hacen posible Campus Lisandro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-lg transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Formando los Docentes del 
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Futuro</span>
          </h2>
          <h3 className="text-2xl font-semibold mb-6">¿Listo para Comenzar tu Transformación?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            En E.S.FD, creemos que la formación docente de calidad es la base de una educación transformadora. 
            Únete a cientos de docentes que ya han transformado su práctica educativa con E.S.FD
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center"
            >
              Explorar Cursos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
            >
              Contactar Equipo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};