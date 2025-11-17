/**
 * Custom React hook for managing toast notifications
 * Provides methods to show success, error, and info toasts
 */
import { useState } from 'react';
import type { ToastType } from '../components/toast/Toast';

interface ToastMessage {
    message: string;
    type: ToastType;
}

export const useToast = () => {
    const [toast, setToast] = useState<ToastMessage | null>(null);

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type });
    };

    const showError = (message: string) => {
        showToast(message, 'error');
    };

    const showSuccess = (message: string) => {
        showToast(message, 'success');
    };

    const showInfo = (message: string) => {
        showToast(message, 'info');
    };

    const closeToast = () => {
        setToast(null);
    };

    return {
        toast,
        showToast,
        showError,
        showSuccess,
        showInfo,
        closeToast,
    };
};
