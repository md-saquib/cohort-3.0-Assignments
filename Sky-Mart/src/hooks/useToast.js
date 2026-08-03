import { useDispatch, useSelector } from 'react-redux'
import { showToast, hideToast } from '../features/toast/toastSlice'

let toastTimer = null

export function useToast() {
    const dispatch = useDispatch()
    const toastState = useSelector((state) => state.toast)

    const triggerToast = (message, type = 'success') => {
        if (toastTimer) {
            clearTimeout(toastTimer)
        }
        dispatch(showToast({ message, type }))
        toastTimer = setTimeout(() => {
            dispatch(hideToast())
            toastTimer = null
        }, 3000)
    }

    return {
        toast: toastState,
        triggerToast,
    }
}
export default useToast
