'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X, CheckCircle, AlertCircle, Info, AlertTriangle,
  XCircle, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type NotificationType = 'success' | 'destructive' | 'info' | 'warning' | 'error';

interface Toast {
  id: string;
  message: string;
  type: NotificationType;
}

interface DialogParams {
  title: string;
  message: string;
  type?: NotificationType;
  onConfirm?: (inputValue?: string) => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  showInput?: boolean;
  inputPlaceholder?: string;
  defaultValue?: string;
}

interface NotificationContextType {
  // Toast API
  addNotification: (message: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
  // Dialog API
  showNotification: (params: DialogParams) => void; // Keeping name for compatibility with admin panel
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);
  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogParams, setDialogParams] = useState<DialogParams | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Toast Logic
  const removeNotification = useCallback((id: string) => {
    setToasts((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback((message: string, type: NotificationType = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 5000);
  }, [removeNotification]);

  // Dialog Logic
  const showNotification = useCallback((params: DialogParams) => {
    setDialogParams(params);
    setInputValue(params.defaultValue || '');
    setDialogOpen(true);
  }, []);

  const hideNotification = useCallback(() => {
    setDialogOpen(false);
    setTimeout(() => setDialogParams(null), 300);
  }, []);

  const handleConfirm = () => {
    if (dialogParams?.onConfirm) {
      dialogParams.onConfirm(dialogParams.showInput ? inputValue : undefined);
    }
    hideNotification();
  };

  const handleCancel = () => {
    if (dialogParams?.onCancel) {
      dialogParams.onCancel();
    }
    hideNotification();
  };

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification, showNotification, hideNotification }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[110] flex flex-col gap-2 w-full max-w-sm">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={`flex items-start gap-3 p-4 rounded-2xl border-2 shadow-lg backdrop-blur-md ${
                t.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-700' :
                t.type === 'destructive' || t.type === 'error' ? 'bg-destructive/10 border-destructive/20 text-destructive' :
                t.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700' :
                'bg-blue-500/10 border-blue-500/20 text-blue-700'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {t.type === 'success' && <CheckCircle size={18} />}
                {(t.type === 'destructive' || t.type === 'error') && <AlertCircle size={18} />}
                {t.type === 'warning' && <AlertTriangle size={18} />}
                {t.type === 'info' && <Info size={18} />}
              </div>
              <p className="text-xs font-black uppercase tracking-tight flex-1">{t.message}</p>
              <button onClick={() => removeNotification(t.id)} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Dialog Overlay */}
      <AnimatePresence>
        {dialogOpen && dialogParams && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border-2 border-border rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className={`p-6 flex flex-col items-center text-center gap-4 ${
                dialogParams.type === 'error' || dialogParams.type === 'destructive' ? 'bg-destructive/5' :
                dialogParams.type === 'warning' ? 'bg-amber-500/5' :
                dialogParams.type === 'success' ? 'bg-primary/5' : 'bg-blue-500/5'
              }`}>
                <div className={`p-4 rounded-3xl ${
                  dialogParams.type === 'error' || dialogParams.type === 'destructive' ? 'bg-destructive/10 text-destructive' :
                  dialogParams.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                  dialogParams.type === 'success' ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-500'
                }`}>
                  {(dialogParams.type === 'error' || dialogParams.type === 'destructive') && <XCircle size={32} />}
                  {dialogParams.type === 'warning' && <AlertTriangle size={32} />}
                  {dialogParams.type === 'success' && <CheckCircle2 size={32} />}
                  {(dialogParams.type === 'info' || !dialogParams.type) && <Info size={32} />}
                </div>
                <div>
                  <h3 className="text-2xl font-black italic text-foreground tracking-tight uppercase">{dialogParams.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium mt-1">{dialogParams.message}</p>
                </div>
              </div>

              {dialogParams.showInput && (
                <div className="px-8 pb-6 pt-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={dialogParams.inputPlaceholder || "Type here..."}
                    className="w-full p-4 bg-muted/50 border-2 border-border rounded-2xl focus:ring-2 focus:ring-primary outline-none font-bold text-foreground"
                    autoFocus
                  />
                </div>
              )}

              <div className="p-6 bg-muted/30 flex gap-3">
                {(dialogParams.onConfirm || dialogParams.onCancel) ? (
                  <>
                    <Button
                      variant="ghost"
                      onClick={handleCancel}
                      className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-xs"
                    >
                      {dialogParams.cancelLabel || "Cancel"}
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      className={`flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg ${
                        dialogParams.type === 'error' || dialogParams.type === 'destructive' ? 'bg-destructive hover:bg-destructive/90 shadow-destructive/20' :
                        dialogParams.type === 'warning' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' :
                        'bg-primary hover:bg-primary/90 shadow-primary/20'
                      }`}
                    >
                      {dialogParams.confirmLabel || "Confirm"}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={hideNotification}
                    className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs bg-foreground text-background"
                  >
                    Dismiss
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
}
