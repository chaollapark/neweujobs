import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'EU Jobs Brussels - Find Your Career in the EU Bubble'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #003399 0%, #001a4d 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 'bold', color: 'white', marginBottom: 16, display: 'flex' }}>
          EU Jobs Brussels
        </div>
        <div style={{ fontSize: 32, color: '#FFD700', display: 'flex' }}>
          Find Your Career in the EU Bubble
        </div>
        <div style={{ fontSize: 22, color: '#ccc', marginTop: 32, display: 'flex' }}>
          eujobs.co
        </div>
      </div>
    ),
    { ...size }
  )
}
