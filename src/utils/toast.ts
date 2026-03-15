import { toast } from 'react-toastify';

export const toastError = (message: string) => {
  toast.error(message, { position: 'top-right', autoClose: 5000 });
};

export const toastSuccess = (message: string) => {
  toast.success(message, { position: 'top-right', autoClose: 3000 });
};

export const toastInfo = (message: string) => {
  toast.info(message, { position: 'top-right', autoClose: 4000 });
};

export const toastWarning = (message: string) => {
  toast.warning(message, { position: 'top-right', autoClose: 4000 });
};
