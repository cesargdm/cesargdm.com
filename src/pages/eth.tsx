import React from 'react'

import Template from '../templates'

function Eth() {
  function handleCopyAddress() {
    if (typeof window !== 'undefined') {
      window?.navigator.clipboard.writeText(
        `0xe3a856e4034d25ff68b3702b8f1618173bbfa130`,
      )
    }
  }

  return (
    <Template>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          height: '100%',
        }}
      >
        <button
          onClick={handleCopyAddress}
          style={{ fontWeight: '600', padding: '0 10px' }}
        >
          cesargdm.eth
        </button>
        <blockquote
          style={{
            opacity: '0.5',
            marginTop: 10,
            fontWeight: '600',
            fontSize: '0.8rem',
          }}
        >
          Want to drop a tip?
        </blockquote>
      </div>
    </Template>
  )
}

export default Eth
