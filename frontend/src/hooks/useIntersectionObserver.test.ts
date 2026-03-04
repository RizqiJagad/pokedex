import { renderHook } from '@testing-library/react';
import { useIntersectionObserver } from './useIntersectionObserver';

describe('useIntersectionObserver', () => {
    beforeEach(() => {
        // Clear mock calls before each test
        jest.clearAllMocks();
    });

    it('should return undefined entry initially and setup observer', () => {
        const elementRef = { current: document.createElement('div') };

        const { result } = renderHook(() => useIntersectionObserver(elementRef, { threshold: 0.5 }));

        expect(result.current).toBeUndefined();
        // Check if IntersectionObserver was called
        expect(window.IntersectionObserver).toHaveBeenCalled();
    });

    it('should disconnect observer on unmount', () => {
        const elementRef = { current: document.createElement('div') };
        const { unmount } = renderHook(() => useIntersectionObserver(elementRef));

        // Because we mock it as a class, we need to inspect the mock instance
        const observerMockInstance = (window.IntersectionObserver as jest.Mock).mock.results[0].value;
        expect(observerMockInstance.disconnect).not.toHaveBeenCalled();

        unmount();

        expect(observerMockInstance.disconnect).toHaveBeenCalled();
    });

    it('should not setup observer if elementRef is null', () => {
        const elementRef = { current: null };
        renderHook(() => useIntersectionObserver(elementRef));

        expect(window.IntersectionObserver).not.toHaveBeenCalled();
    });
});
