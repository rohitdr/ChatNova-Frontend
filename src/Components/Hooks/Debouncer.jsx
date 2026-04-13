import React, { useEffect, useState } from 'react'

export default function useDebounce(value,delay) {


    const [debouncerValue ,setDebouncerValue]=useState(value)

    useEffect(()=>{
      const timeout=setTimeout(() => {
        setDebouncerValue(value)
      }, delay);
      return ()=>clearTimeout(timeout)
    },[value,delay])
  return debouncerValue
}
