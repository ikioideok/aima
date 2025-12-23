import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useLayoutEffect(() => {
        // Prevent browser from restoring scroll position automatically
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Disable smooth scrolling temporarily
        document.documentElement.style.scrollBehavior = 'auto';

        if (hash) {
            // If there is a hash, scroll to the element
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'auto', block: 'start' });
            }
        } else {
            // If no hash, scroll to top
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }

        // Re-enable smooth scrolling after a small tick
        const timeoutId = setTimeout(() => {
            document.documentElement.style.scrollBehavior = '';
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [pathname, hash]);

    return null;
};
