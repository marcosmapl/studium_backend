import { useState, useEffect } from 'react';

/**
 * Hook para aplicar debounce em valores
 * Útil para otimizar buscas e inputs que disparam operações custosas
 * 
 * @param {any} value - Valor a ser "debounced"
 * @param {number} delay - Delay em milissegundos (padrão: 300ms)
 * @returns {any} Valor com debounce aplicado
 */
export const useDebounce = (value, delay = 300) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};
