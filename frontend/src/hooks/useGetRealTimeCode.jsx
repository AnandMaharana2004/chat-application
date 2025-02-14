import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

function useGetRealTimeCode() {
    const dispatch = useDispatch()
    const {socket} = useSelector(store => store.socket)
    socket.on("code-recive",(code)=>{
        dispatch()
    })
    useEffect(() => {
      (()=>{

      })()
    
    }, [])
    
  return (
    <div>useGetRealTimeCode</div>
  )
}

export default useGetRealTimeCode