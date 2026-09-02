import { useState, useEffect } from 'react';
import { Article } from '../types';

let cachedArticles: Article[] | null = null;

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>(() => cachedArticles || []);
  const [isLoading, setIsLoading] = useState<boolean>(() => !cachedArticles);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedArticles && cachedArticles.length > 0) {
      setArticles(cachedArticles);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        const base = import.meta.env.BASE_URL || './';
        const cleanBase = base.endsWith('/') ? base : `${base}/`;
        
        // Attempt loading compact json first
        let response = await fetch(`${cleanBase}data/articles.min.json`);
        if (!response.ok) {
          response = await fetch('./data/articles.min.json');
        }
        if (!response.ok) {
          response = await fetch('/data/articles.min.json');
        }
        if (!response.ok) {
          response = await fetch(`${cleanBase}data/articles.json`);
        }

        if (!response.ok) {
          throw new Error(`Error ${response.status}: no se pudo cargar la base de artículos.`);
        }

        const data: Article[] = await response.json();
        cachedArticles = data;

        if (isMounted) {
          setArticles(data);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('Failed to load articles data:', err);
        if (isMounted) {
          setError(err.message || 'Error al cargar los códigos legales');
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { articles, isLoading, error };
}
