import React from 'react'
import { contextData } from '../../context/ContextProvider'

const Profile = () => {

  const { user, open } = contextData();
  return (


    <button className="hidden  md:flex items-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full cursor-pointer">

      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
        {user?.name?.charAt(0)?.toUpperCase() || "?"}
      </div>

      <span>{user?.name || "Guest"}</span>

    </button>




  )
}

export default Profile