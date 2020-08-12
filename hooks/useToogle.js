import React, { useState } from 'react'

const useToogle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue)
  const toogle = () => setValue(previousState => !previousState)
  return [value, toogle]
}

export default useToogle
