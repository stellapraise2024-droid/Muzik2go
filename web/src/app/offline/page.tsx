// Shown by the service worker when a navigation fails offline.
export default function Offline() {
  return (
    <main style={{ background: '#121A26', color: '#F2F5F9', minHeight: '100vh', fontFamily: 'Inter,system-ui', display: 'grid', placeItems: 'center', padding: 32, textAlign: 'center' }}>
      <div>
        <p style={{ background: '#3A4A66', display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>OFFLINE</p>
        <h1 style={{ fontSize: 40, margin: '16px 0 8px' }}>No connection</h1>
        <p style={{ color: '#C7CDD6', fontSize: 17, maxWidth: 420 }}>
          Muzik2Go needs the internet to load your studio, songs and AI coach.
          Check your connection and try again.
        </p>
        <a href="/" style={{ display: 'inline-block', marginTop: 20, background: '#0AC8FF', color: '#062A3A', padding: '14px 32px', borderRadius: 12, fontWeight: 800, textDecoration: 'none' }}>Retry</a>
      </div>
    </main>
  );
}
