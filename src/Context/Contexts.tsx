import React from 'react';

export default function Contexts({ children }: { children: React.ReactNode }) {
  // Add contexts around children (if any)
  // Use a zustand store to mitigate contexts (if possible)
  return <>{children}</>;
}
