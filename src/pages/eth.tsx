import { graphql } from 'gatsby'
import React from 'react'
import styled from 'styled-components'

import Template from '../templates'

const NftImage = styled.img`
  border: 1px solid var(--colors--border);
  display: block;
  min-width: 0;
  width: 100%;
  border-radius: 20px;
  margin-bottom: 10px;
  min-height: 200px;
  background-color: var(--colors--border);
`

const NftTitle = styled.p`
  font-weight: 700;
  text-align: center;
  font-size: 0.9rem;
  margin: 0;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
`

function Eth({ data: { allNft } }: any) {
  const nfts = allNft.nodes

  function handleCopyAddress() {
    if (typeof window !== 'undefined') {
      window?.navigator.clipboard.writeText(
        `0xe3a856e4034d25ff68b3702b8f1618173bbfa130`,
      )
    }
  }

  return (
    <Template title="eth">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: '100%',
        }}
      >
        <button
          onClick={handleCopyAddress}
          style={{ fontWeight: '600', padding: '0 10px', alignSelf: 'center' }}
        >
          cesargdm.eth
        </button>
        <h2>Gallery</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            alignItems: 'flex-end',
            gap: 16,
          }}
        >
          {nfts.map((token: any) => (
            <div key={token.id}>
              <NftImage
                // Ha ha this is a joke ;)
                draggable={false}
                //
                src={token.imageUrl}
                alt={`${token.name}. ${token.description}`}
              />
              <NftTitle>{token.name}</NftTitle>
            </div>
          ))}
        </div>
      </div>
    </Template>
  )
}

export const query = graphql`
  query GetAllNfts {
    allNft {
      nodes {
        id
        name
        description
        permalink
        imageUrl
      }
    }
  }
`

export default Eth
