import React, { useEffect } from 'react'
import {useSelector} from 'react-redux'

function useGetFriendList() {
    const {authUser} = useSelector((store)=> store.user)
  useEffect(()=>{
    (async ()=>{
        if(!authUser) return

    })()
  },[authUser])
}

export default useGetFriendList