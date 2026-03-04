import '@testing-library/jest-dom';

const observe = jest.fn();
const disconnect = jest.fn();
const unobserve = jest.fn();

const MockIntersectionObserver = jest.fn().mockImplementation(() => ({
    observe,
    disconnect,
    unobserve,
}));

Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
});
