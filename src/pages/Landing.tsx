import React from 'react';
import { Hero } from '../components/landing/Hero';
import { FeaturedCourses } from '../components/landing/FeaturedCourses';
import { Testimonials } from '../components/landing/Testimonials';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedCourses />
      <Testimonials />
    </div>
  );
};