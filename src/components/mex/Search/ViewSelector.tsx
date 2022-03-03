import React from 'react'

export enum View {
  Card = 'card',
  List = 'list'
  // NotFound = 'notFound'
}

const ViewSelector = ({ onChangeView }: { onChangeView: (view: View) => void }) => {
  return (
    <div>
      {Object.entries(View).map(([view, name]) => (
        <button key={`ViewSelectButton_${view}`} onClick={() => onChangeView(View[view])}>
          {name}
        </button>
      ))}
    </div>
  )
}

export default ViewSelector
