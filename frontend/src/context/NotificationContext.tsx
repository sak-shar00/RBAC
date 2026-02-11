import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { ToastContainer, useToast as useToastBase } from "../components/Toast";
import ConfirmationDialog, { type ConfirmationDialogProps } from "../components/ConfirmationDialog";

type ToastType = "success" | "error" | "info";

interface NotificationContextType {
  showToast: (message: string, type?: ToastType) => void;
  showConfirmation: (config: Omit<ConfirmationDialogProps, "isOpen">) => void;
  hideConfirmation: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { toasts, addToast, removeToast } = useToastBase();
  const [confirmationConfig, setConfirmationConfig] = useState<
    (ConfirmationDialogProps & { onConfirm: () => void }) | null
  >(null);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    addToast(message, type);
  }, [addToast]);

  const showConfirmation = useCallback(
    (config: Omit<ConfirmationDialogProps, "isOpen">) => {
      setConfirmationConfig({
        ...config,
        isOpen: true,
        onConfirm: () => {
          config.onConfirm?.();
          setConfirmationConfig(null);
        },
      });
    },
    []
  );

  const hideConfirmation = useCallback(() => {
    setConfirmationConfig(null);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ showToast, showConfirmation, hideConfirmation }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {confirmationConfig && (
        <ConfirmationDialog
          isOpen={true}
          onClose={hideConfirmation}
          onConfirm={confirmationConfig.onConfirm}
          title={confirmationConfig.title}
          message={confirmationConfig.message}
          confirmText={confirmationConfig.confirmText}
          cancelText={confirmationConfig.cancelText}
          variant={confirmationConfig.variant}
          isLoading={confirmationConfig.isLoading}
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}

