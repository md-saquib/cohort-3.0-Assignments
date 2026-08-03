export const formatPrice = (value) => {
    return `₹${Number(value).toLocaleString('en-IN')}`
}
