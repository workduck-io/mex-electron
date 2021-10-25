import React from 'react'

export const errorMessages = {
  required: (field: string) => `${field} is required`,
  pattern: (field: string) => `Invalid ${field}`
}

export const PasswordRequirements = () => (
  <>
    <p>Requirements for password:</p>
    <ul>
      <li>At least 6 characters</li>
      <li>A uppercase letter</li>
      <li>A lowercase letter</li>
      <li>A number and</li>
      <li>A special symbol</li>
    </ul>
  </>
)
