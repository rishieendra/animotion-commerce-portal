
import { useEffect, useRef, useState } from 'react';

export const useAnimationObserver = (options = {}) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);

  const observer = useRef<IntersectionObserver | null>(null);

  const defaultOptions = {
    threshold: 0.1,
    root: null,
    rootMargin: '0px',
    ...options,
  };

  useEffect(() => {
    // Initialize IntersectionObserver
    observer.current = new IntersectionObserver((observedEntries) => {
      setEntries(observedEntries);
      
      observedEntries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, defaultOptions);

    // Observe all elements
    elements.forEach(element => {
      observer.current?.observe(element);
    });

    return () => {
      // Clean up by disconnecting observer
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [elements, defaultOptions]);

  const observe = (element: Element) => {
    setElements(prev => [...prev, element]);
  };

  const unobserve = (element: Element) => {
    if (observer.current) {
      observer.current.unobserve(element);
    }
    setElements(prev => prev.filter(el => el !== element));
  };

  return { observe, unobserve, entries };
};

export default useAnimationObserver;
