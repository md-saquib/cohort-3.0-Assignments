import { useDispatch, useSelector } from 'react-redux'
import { hideToast } from '../../../features/toast/toastSlice'

export default function useToastComponent() {
    const dispatch = useDispatch()
    const { message, type } = useSelector((state) => state.toast)

    const handleClose = () => {
        dispatch(hideToast())
    }

    return {
        message,
        type,
        onClose: handleClose,
    }
}
