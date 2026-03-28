import React from 'react'
import FeatureAssistant from './_components/FeatureAssistant'
import History from './_components/History'
import Feedback from './_components/Feedback'

function Dashboard() {
  return (
    <div>
      <FeatureAssistant />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 20,
        marginTop: 40
      }}>
        <History />
        <Feedback />
      </div>
    </div>
  )
}

export default Dashboard