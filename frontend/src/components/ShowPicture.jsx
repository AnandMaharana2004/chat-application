import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

function ShowPicture() {
     const {showImage} = useSelector(store => store.user)
     
  return (
    <div className=' Kumar'>
     <img src="https://avatar.iran.liara.run/public/boy?username=amit" alt="" />
    </div>
  )
}

export default ShowPicture