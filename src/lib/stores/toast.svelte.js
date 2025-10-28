let toasts = $state([]);
let toastId = $state(0);
const MAX_TOASTS = 5; // Adjust this limit as needed

export const toastState = {
  get toasts() {
    return toasts;
  },

  add(message, title, type = "info", duration = 3000) {
    const id = toastId++;
    const toast = { id, message, title, type, duration };

    // Add new toast
    toasts = [...toasts, toast];

    // If limit exceeded, remove oldest toast
    if (toasts.length > MAX_TOASTS) {
      toasts = toasts.slice(1);
    }

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    return id;
  },

  remove(id) {
    toasts = toasts.filter((t) => t.id !== id);
  },

  success(message, duration) {
    return this.add(message, "Sucesso", "success", duration);
  },

  error(message, duration) {
    return this.add(message, "Erro", "error", duration);
  },

  warning(message, duration) {
    return this.add(message, "Aviso", "warning", duration);
  },

  info(message, duration) {
    return this.add(message, "Info", "info", duration);
  },
};
