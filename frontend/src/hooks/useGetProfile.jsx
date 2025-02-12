import axios from 'axios'
import React, { useEffect } from 'react'


function useGetProfile({id}) {
    const url = `${import.meta.BASEURL}/user/getprofile/id`
    useEffect(() => {
      axios.get(url)
    
      return () => {
        second
      }
    }, [third])
    
  return (
    <div>useGetProfile</div>
  )
}

export default useGetProfile