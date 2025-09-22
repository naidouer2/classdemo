import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { PromptTemplate } from '@/types/chat';
import { DEFAULT_PROMPT_TEMPLATES } from '@/lib/chat-api';

interface UsePromptTemplatesReturn {
  templates: PromptTemplate[];
  categories: string[];
  favorites: string[];
  
  // Actions
  addTemplate: (template: Omit<PromptTemplate, 'id'>) => void;
  updateTemplate: (id: string, template: Partial<PromptTemplate>) => void;
  deleteTemplate: (id: string) => void;
  toggleFavorite: (id: string) => void;
  getTemplateById: (id: string) => PromptTemplate | undefined;
  getTemplatesByCategory: (category: string) => PromptTemplate[];
  searchTemplates: (query: string) => PromptTemplate[];
  renderTemplate: (template: string, variables: Record<string, string>) => string;
}

export function usePromptTemplates(): UsePromptTemplatesReturn {
  const [templates, setTemplates] = useLocalStorage<PromptTemplate[]>({ 
    key: 'prompt_templates', 
    defaultValue: DEFAULT_PROMPT_TEMPLATES 
  });
  
  const [favorites, setFavorites] = useLocalStorage<string[]>({ 
    key: 'prompt_favorites', 
    defaultValue: [] 
  });

  const categories = Array.from(new Set(templates.map(t => t.category)));

  const addTemplate = useCallback((template: Omit<PromptTemplate, 'id'>) => {
    const newTemplate: PromptTemplate = {
      ...template,
      id: Date.now().toString()
    };
    setTemplates(prev => [...prev, newTemplate]);
  }, [setTemplates]);

  const updateTemplate = useCallback((id: string, updates: Partial<PromptTemplate>) => {
    setTemplates(prev => prev.map(template => 
      template.id === id ? { ...template, ...updates } : template
    ));
  }, [setTemplates]);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
    setFavorites(prev => prev.filter(favId => favId !== id));
  }, [setTemplates, setFavorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(favId => favId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, [setFavorites]);

  const getTemplateById = useCallback((id: string) => {
    return templates.find(template => template.id === id);
  }, [templates]);

  const getTemplatesByCategory = useCallback((category: string) => {
    return templates.filter(template => template.category === category);
  }, [templates]);

  const searchTemplates = useCallback((query: string) => {
    if (!query.trim()) return templates;
    
    const lowercaseQuery = query.toLowerCase();
    return templates.filter(template => 
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.content.toLowerCase().includes(lowercaseQuery) ||
      template.category.toLowerCase().includes(lowercaseQuery)
    );
  }, [templates]);

  const renderTemplate = useCallback((template: string, variables: Record<string, string>) => {
    let rendered = template;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{\\${key}}`, 'g');
      rendered = rendered.replace(regex, value);
    });
    return rendered;
  }, []);

  return {
    templates,
    categories,
    favorites,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    toggleFavorite,
    getTemplateById,
    getTemplatesByCategory,
    searchTemplates,
    renderTemplate
  };
}