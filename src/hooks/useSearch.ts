import { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { allCourses } from '../data/mockData';
import { Course } from '../types';

export interface SearchFilters {
  category: string;
  level: string;
  priceRange: [number, number];
  rating: number;
  duration: string;
}

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    level: 'all',
    priceRange: [0, 200],
    rating: 0,
    duration: 'all'
  });
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('campus-search-history', []);

  const addToSearchHistory = (term: string) => {
    if (term.trim() && !searchHistory.includes(term)) {
      setSearchHistory(prev => [term, ...prev.slice(0, 9)]); // Keep last 10 searches
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const filteredCourses = useMemo(() => {
    let results = allCourses;

    // Text search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(course =>
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term) ||
        course.shortDescription.toLowerCase().includes(term) ||
        course.instructor.toLowerCase().includes(term) ||
        course.category.toLowerCase().includes(term) ||
        course.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      results = results.filter(course => course.category === filters.category);
    }

    // Level filter
    if (filters.level !== 'all') {
      results = results.filter(course => course.level === filters.level);
    }

    // Price range filter
    results = results.filter(course => 
      course.price >= filters.priceRange[0] && course.price <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.rating > 0) {
      results = results.filter(course => course.rating >= filters.rating);
    }

    // Duration filter
    if (filters.duration !== 'all') {
      // This would need more sophisticated filtering based on actual duration data
      // For now, we'll use a simple approach
      results = results.filter(course => {
        const weeks = parseInt(course.duration.split(' ')[0]) || 0;
        switch (filters.duration) {
          case 'short': return weeks <= 4;
          case 'medium': return weeks > 4 && weeks <= 12;
          case 'long': return weeks > 12;
          default: return true;
        }
      });
    }

    return results;
  }, [searchTerm, filters]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      level: 'all',
      priceRange: [0, 200],
      rating: 0,
      duration: 'all'
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    resetFilters,
    filteredCourses,
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
  };
};