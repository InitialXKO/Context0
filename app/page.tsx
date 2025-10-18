export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        padding: '32px',
        color: 'rgba(226,232,240,0.92)',
        background: 'radial-gradient(circle at top, rgba(30,41,59,0.6), rgba(2,6,23,0.95))',
        textAlign: 'center'
      }}
    >
      <h1 style={{ fontSize: '2.4rem', fontWeight: 700 }}>速成法写作模块</h1>
      <p style={{ maxWidth: '520px', fontSize: '1rem', color: 'rgba(148, 163, 184, 0.88)' }}>
        通过四个计时步骤快速搭建文章结构。点击下方按钮直接进入互动式练习界面。
      </p>
      <a
        href="/speed-method"
        style={{
          padding: '12px 20px',
          borderRadius: '999px',
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.8), rgba(139, 92, 246, 0.8))',
          color: '#020617',
          fontWeight: 600,
          textDecoration: 'none'
        }}
      >
        开始速成法练习
      </a>
    </main>
  );
}
