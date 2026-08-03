export default function FormError({ message }) {
    if (!message) return null

    return <p className="text-sm text-red-500">{message}</p>
}
