'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BeatLoader } from "react-spinners";
import { FaSave, FaTrash } from "react-icons/fa";
import React from "react";
import { DialogOverlay } from "@radix-ui/react-dialog";

interface ModalFormProps {
  width?: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { [key: string]: string }) => void;
  children: React.ReactNode;
  isProcessing?: boolean;
  isDestructive?: boolean;
}

const ModalForm: React.FC<ModalFormProps> = ({
  width,
  title,
  isOpen,
  onClose,
  onSubmit,
  children,
  isProcessing = false,
  isDestructive = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: { [key: string]: string } = {};
    const elements = (e.target as HTMLFormElement).elements as any;

    for (let element of elements) {
      if (element.name) {
        formData[element.name] = element.value;
      }
    }

    onSubmit(formData);
  };

  const getMaxWidthClass = (size: string = 'xl') => {
    const map: Record<string, string> = {
      sm: 'sm:max-w-sm',
      md: 'sm:max-w-md',
      lg: 'sm:max-w-lg',
      xl: 'sm:max-w-xl',
      '2xl': 'sm:max-w-2xl',
      '4xl': 'sm:max-w-4xl',
      '6xl': 'sm:max-w-6xl',
    };
    return map[size] || 'sm:max-w-xl';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
  {/* Backdrop */}
  <DialogOverlay className="fixed inset-0 z-9999 bg-black/50 backdrop-blur-sm" />

  {/* Konten dialog */}
  <DialogContent
    className={`fixed left-1/2 top-1/2 z-99999 w-full ${getMaxWidthClass(width)} -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white dark:bg-zinc-900 p-6 shadow-xl`}
    onPointerDownOutside={(e) => e.preventDefault()}
  >
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
    </DialogHeader>

    <form onSubmit={handleSubmit} className="relative">
      <div className="space-y-4 py-4">{children}</div>

      {isProcessing && (
        <div className="absolute inset-0 bg-white/70 dark:bg-black/50 z-10 flex items-center justify-center rounded-lg">
          <BeatLoader size={12} color="#0f766e" />
        </div>
      )}

      <DialogFooter className="mt-6 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant={isDestructive ? "destructive" : "default"}
          disabled={isProcessing}
        >
          {isProcessing ? (
            "Processing..."
          ) : isDestructive ? (
            <>
              Delete <FaTrash className="ml-2" />
            </>
          ) : (
            <>
              Save <FaSave className="ml-2" />
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
  );
};

export default ModalForm;