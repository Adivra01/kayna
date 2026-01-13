import { toast as sonnerToast } from "sonner";
import { CustomToast } from "@/components/CustomToast";

type ToastOptions = {
  description?: string;
  duration?: number;
};

export const showToast = {
  success: (title: string, options?: ToastOptions) => {
    return sonnerToast.custom(
      (id) => (
        <CustomToast
          type="success"
          title={title}
          description={options?.description}
          onDismiss={() => sonnerToast.dismiss(id)}
        />
      ),
      { duration: options?.duration ?? 4000 }
    );
  },

  error: (title: string, options?: ToastOptions) => {
    return sonnerToast.custom(
      (id) => (
        <CustomToast
          type="error"
          title={title}
          description={options?.description}
          onDismiss={() => sonnerToast.dismiss(id)}
        />
      ),
      { duration: options?.duration ?? 4000 }
    );
  },

  favorite: (title: string, options?: ToastOptions) => {
    return sonnerToast.custom(
      (id) => (
        <CustomToast
          type="favorite"
          title={title}
          description={options?.description}
          onDismiss={() => sonnerToast.dismiss(id)}
        />
      ),
      { duration: options?.duration ?? 4000 }
    );
  },

  cart: (title: string, options?: ToastOptions) => {
    return sonnerToast.custom(
      (id) => (
        <CustomToast
          type="cart"
          title={title}
          description={options?.description}
          onDismiss={() => sonnerToast.dismiss(id)}
        />
      ),
      { duration: options?.duration ?? 4000 }
    );
  },

  info: (title: string, options?: ToastOptions) => {
    return sonnerToast.custom(
      (id) => (
        <CustomToast
          type="info"
          title={title}
          description={options?.description}
          onDismiss={() => sonnerToast.dismiss(id)}
        />
      ),
      { duration: options?.duration ?? 4000 }
    );
  },
};
