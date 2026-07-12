import React from 'react';
import Modal from '@/Components/Modal';

interface FormModalProps {
    show: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export default function FormModal({
    show,
    onClose,
    title,
    children,
    maxWidth = 'lg',
}: FormModalProps) {
    return (
        <Modal show={show} onClose={onClose} maxWidth={maxWidth}>
            <div className="p-6 sm:p-8 bg-surface text-on-surface">
                <div className="flex items-center justify-between pb-4 border-b border-outline-variant/60">
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-on-surface-variant hover:bg-tertiary/60 transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                <div className="mt-6">{children}</div>
            </div>
        </Modal>
    );
}
