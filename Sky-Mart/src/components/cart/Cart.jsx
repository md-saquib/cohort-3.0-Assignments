import { ShoppingCart } from 'lucide-react'
import React from 'react'

const Cart = () => {
  return (
    <button className="flex items-center gap-3 cursor-pointer">
      <ShoppingCart size={20} />

    </button>
  )
}

export default Cart