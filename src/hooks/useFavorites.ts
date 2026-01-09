import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Favorite {
  id: string;
  product_id: string;
  created_at: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [userId]);

  const fetchFavorites = async () => {
    if (!userId) return;
    
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('favorites')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching favorites:', error);
    } else {
      setFavorites((data || []) as Favorite[]);
    }
    setLoading(false);
  };

  const isFavorite = useCallback((productId: string) => {
    return favorites.some(f => f.product_id === productId);
  }, [favorites]);

  const toggleFavorite = async (productId: string): Promise<boolean> => {
    if (!userId) {
      toast.error('Connecte-toi pour ajouter aux favoris');
      return false;
    }

    const existing = favorites.find(f => f.product_id === productId);

    if (existing) {
      const { error } = await (supabase as any)
        .from('favorites')
        .delete()
        .eq('id', existing.id);

      if (error) {
        toast.error('Erreur lors de la suppression');
        return true;
      }

      setFavorites(prev => prev.filter(f => f.id !== existing.id));
      return false;
    } else {
      const { data, error } = await (supabase as any)
        .from('favorites')
        .insert({ user_id: userId, product_id: productId })
        .select()
        .single();

      if (error) {
        toast.error('Erreur lors de l\'ajout');
        return false;
      }

      setFavorites(prev => [...prev, data as Favorite]);
      return true;
    }
  };

  const getFavoritesCount = () => favorites.length;

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    getFavoritesCount,
    isAuthenticated: !!userId,
  };
}
