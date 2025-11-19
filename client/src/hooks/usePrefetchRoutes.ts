import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';

const prefetchedRoutes = new Set<string>();

const routeComponentMap: Record<string, () => Promise<any>> = {
  '/catalog': () => import('@/pages/catalog-page'),
  '/products': () => import('@/pages/product-detail-page'),
  '/cart': () => import('@/pages/cart-page'),
  '/wishlist': () => import('@/pages/wishlist-page'),
  '/profile': () => import('@/pages/profile-page'),
  '/checkout': () => import('@/pages/checkout-page'),
  '/comparison': () => import('@/pages/comparison-page'),
  '/login': () => import('@/pages/login-page'),
  '/register': () => import('@/pages/register-page'),
  '/admin': () => import('@/pages/admin/dashboard-page'),
  '/admin/users': () => import('@/pages/admin/users-page'),
  '/admin/products': () => import('@/pages/admin/products-page'),
  '/admin/categories': () => import('@/pages/admin/categories-page'),
  '/admin/promocodes': () => import('@/pages/admin/promocodes-page'),
  '/admin/orders': () => import('@/pages/admin/orders-page'),
  '/admin/support': () => import('@/pages/admin/support-chat-page'),
};

function prefetchRoute(route: string): void {
  if (prefetchedRoutes.has(route)) {
    return;
  }

  const loader = routeComponentMap[route];
  if (!loader) {
    console.warn(`No loader found for route: ${route}`);
    return;
  }

  loader()
    .then(() => {
      prefetchedRoutes.add(route);
      console.log(`✅ Prefetched: ${route}`);
    })
    .catch((error) => {
      console.error(`❌ Failed to prefetch ${route}:`, error);
    });
}

function shouldPrefetch(): boolean {
  if (typeof navigator === 'undefined') return false;

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (connection) {
    if (connection.saveData) {
      return false;
    }
    
    const slowConnections = ['slow-2g', '2g'];
    if (slowConnections.includes(connection.effectiveType)) {
      return false;
    }
  }

  return true;
}

export function usePrefetchRoutes() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authInitialized = useAuthStore((state) => state.authInitialized);
  const user = useAuthStore((state) => state.user);
  const previousAuthState = useRef<boolean | null>(null);

  useEffect(() => {
    if (!authInitialized || !shouldPrefetch()) {
      return;
    }

    const hasStaffRole = user?.roles?.some(role => 
      ['admin', 'marketer', 'consultant'].includes(role)
    );

    const prefetchWithDelay = (routes: string[], delay: number) => {
      setTimeout(() => {
        if (shouldPrefetch()) {
          routes.forEach(route => {
            requestIdleCallback(() => prefetchRoute(route), { timeout: 2000 });
          });
        }
      }, delay);
    };

    if (!isAuthenticated) {
      prefetchWithDelay(['/login', '/register'], 0);
      
      prefetchWithDelay(['/catalog', '/products'], 1000);
    } else {
      prefetchWithDelay(['/catalog', '/cart', '/wishlist', '/products'], 0);
      
      prefetchWithDelay(['/profile', '/checkout'], 3000);
      
      prefetchWithDelay(['/comparison'], 5000);

      if (hasStaffRole) {
        prefetchWithDelay([
          '/admin',
          '/admin/products',
          '/admin/categories',
          '/admin/orders',
          '/admin/promocodes',
          '/admin/users',
          '/admin/support'
        ], 7000);
      }
    }

    if (previousAuthState.current === false && isAuthenticated === true) {
      console.log('🔄 User just authenticated, loading protected routes...');
      
      requestIdleCallback(() => {
        prefetchRoute('/cart');
        prefetchRoute('/wishlist');
        prefetchRoute('/profile');
      });
    }

    previousAuthState.current = isAuthenticated;
  }, [isAuthenticated, authInitialized, user]);
}

export function usePrefetchFromReturnUrl() {
  useEffect(() => {
    if (!shouldPrefetch()) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const returnUrl = params.get('returnUrl');

    if (returnUrl) {
      console.log(`🎯 Detected returnUrl: ${returnUrl}, prefetching...`);
      
      requestIdleCallback(() => {
        const normalizedUrl = returnUrl.split('?')[0].split('#')[0];
        
        if (normalizedUrl.startsWith('/cart')) {
          prefetchRoute('/cart');
        } else if (normalizedUrl.startsWith('/wishlist')) {
          prefetchRoute('/wishlist');
        } else if (normalizedUrl.startsWith('/profile')) {
          prefetchRoute('/profile');
        } else if (normalizedUrl.startsWith('/checkout')) {
          prefetchRoute('/checkout');
        } else if (normalizedUrl.startsWith('/comparison')) {
          prefetchRoute('/comparison');
        } else if (normalizedUrl.startsWith('/admin')) {
          const segments = normalizedUrl.split('/');
          if (segments.length === 2) {
            prefetchRoute('/admin');
          } else if (segments.length === 3) {
            prefetchRoute(`/admin/${segments[2]}`);
          }
        }
      }, { timeout: 500 });
    }
  }, []);
}
