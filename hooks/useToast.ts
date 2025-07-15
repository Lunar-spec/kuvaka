import { toast } from 'sonner'

export function useToast() {
    const showSuccess = (message: string, description: string) => {
        toast.success(message, {
            description
        })
    }

    const showError = (message: string, description: string) => {
        toast.error(message, {
            description
        })
    }

    const showInfo = (message: string, description: string) => {
        toast.info(message, {
            description
        })
    }

    const showLoading = (message: string, description: string) => {
        return toast.loading(message, {
            description
        })
    }

    const dismiss = (toastId: string | number) => {
        toast.dismiss(toastId)
    }

    return {
        showSuccess,
        showError,
        showInfo,
        showLoading,
        dismiss
    }
}
