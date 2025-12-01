"use client";

import { Icon } from "@iconify/react";
import type { ReactNode } from "react";
import {
  Modal as AriaModal,
  Dialog,
  DialogTrigger,
  ModalOverlay,
  type ModalOverlayProps,
} from "react-aria-components";
import { type VariantProps, tv } from "tailwind-variants";

const modalVariants = tv({
  slots: {
    overlay: [
      "fixed inset-0 z-[9999]",
      "bg-noir/50 backdrop-blur-sm",
      "flex items-center justify-center p-4",
      "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:duration-200",
      "data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:duration-150",
    ],
    modal: [
      "w-full overflow-hidden",
      "outline-none",
      "data-[entering]:animate-in data-[entering]:zoom-in-95 data-[entering]:fade-in-0 data-[entering]:duration-200",
      "data-[exiting]:animate-out data-[exiting]:zoom-out-95 data-[exiting]:fade-out-0 data-[exiting]:duration-150",
    ],
    wrapper: [
      "relative w-full max-h-[85vh]",
      "rounded-lg",
      "shadow-xl",
      "bg-blanc",
      "border border-gris-200",
      "flex flex-col",
      "overflow-hidden",
    ],
    header: [
      "flex items-center justify-between gap-4",
      "px-6 py-4",
      "border-b border-gris-200",
      "bg-blanc",
      "flex-shrink-0",
    ],
    title: ["text-xl font-semibold text-noir font-serif", "flex-1"],
    closeButton: [
      "rounded-md p-1.5 -mr-1.5",
      "text-gris-400",
      "transition-all duration-150",
      "hover:bg-gris-100 hover:text-noir",
      "active:scale-95",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-rouge focus-visible:ring-offset-2",
    ],
    content: ["px-6 py-6", "overflow-y-auto", "flex-1", "min-h-0"],
  },
  variants: {
    size: {
      sm: {
        modal: "max-w-sm",
      },
      md: {
        modal: "max-w-md",
      },
      lg: {
        modal: "max-w-2xl",
      },
      xl: {
        modal: "max-w-4xl",
      },
      "2xl": {
        modal: "max-w-6xl",
      },
      full: {
        modal: "max-w-[95vw]",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type ModalVariants = VariantProps<typeof modalVariants>;

export interface ModalProps extends Omit<ModalOverlayProps, "className"> {
  children: ReactNode;
  size?: ModalVariants["size"];
}

export interface ModalContentProps {
  children: ReactNode;
  title?: string;
  hideCloseButton?: boolean;
  onClose?: () => void;
  size?: ModalVariants["size"];
}

export function Modal({ children, size = "md", ...props }: ModalProps) {
  const styles = modalVariants({ size });

  return (
    <ModalOverlay {...props} className={styles.overlay()}>
      <AriaModal className={styles.modal()}>{children}</AriaModal>
    </ModalOverlay>
  );
}

export function ModalContent({
  children,
  title,
  hideCloseButton = false,
  onClose,
  size = "md",
}: ModalContentProps) {
  const styles = modalVariants({ size });

  return (
    <Dialog className="outline-none h-full flex flex-col">
      {({ close }) => (
        <div className={styles.wrapper()}>
          {title && (
            <div className={styles.header()}>
              <h2 className={styles.title()}>{title}</h2>
              {!hideCloseButton && (
                <button
                  type="button"
                  onClick={() => {
                    onClose?.();
                    close();
                  }}
                  className={styles.closeButton()}
                  aria-label="Fermer"
                >
                  <Icon icon="solar:close-circle-bold" className="text-2xl" />
                </button>
              )}
            </div>
          )}
          <div className={styles.content()}>{children}</div>
        </div>
      )}
    </Dialog>
  );
}

export { DialogTrigger };
