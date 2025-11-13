/**
 * Unit tests for useToast hook
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../../src/hooks/useToast';

describe('useToast', () => {
    it('initializes with no toast', () => {
        const { result } = renderHook(() => useToast());

        expect(result.current.toast).toBeNull();
    });

    it('shows success toast', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showSuccess('Success message');
        });

        expect(result.current.toast).toEqual({
            message: 'Success message',
            type: 'success',
        });
    });

    it('shows error toast', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showError('Error message');
        });

        expect(result.current.toast).toEqual({
            message: 'Error message',
            type: 'error',
        });
    });

    it('shows info toast', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showInfo('Info message');
        });

        expect(result.current.toast).toEqual({
            message: 'Info message',
            type: 'info',
        });
    });

    it('shows custom toast with specific type', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showToast('Custom message', 'success');
        });

        expect(result.current.toast).toEqual({
            message: 'Custom message',
            type: 'success',
        });
    });

    it('closes toast', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showSuccess('Success message');
        });

        expect(result.current.toast).not.toBeNull();

        act(() => {
            result.current.closeToast();
        });

        expect(result.current.toast).toBeNull();
    });

    it('replaces existing toast when showing new one', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showSuccess('First message');
        });

        expect(result.current.toast?.message).toBe('First message');

        act(() => {
            result.current.showError('Second message');
        });

        expect(result.current.toast?.message).toBe('Second message');
        expect(result.current.toast?.type).toBe('error');
    });

    it('provides all required methods', () => {
        const { result } = renderHook(() => useToast());

        expect(typeof result.current.showToast).toBe('function');
        expect(typeof result.current.showSuccess).toBe('function');
        expect(typeof result.current.showError).toBe('function');
        expect(typeof result.current.showInfo).toBe('function');
        expect(typeof result.current.closeToast).toBe('function');
    });
});
