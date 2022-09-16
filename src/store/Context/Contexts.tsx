import React from 'react'

const Contexts: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  // Add contexts around children (if any)
  // Use a zustand store to mitigate contexts (if possible)
  return <>{children}</>
}

export default Contexts
