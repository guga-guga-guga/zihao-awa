const polygons = [
  { points: '120,180 220,120 260,240 160,300', duration: '11s', delay: '0s' },
  { points: '1080,120 1200,180 1160,320 1040,260', duration: '14s', delay: '-3s' },
  { points: '320,620 420,560 480,680 380,740', duration: '13s', delay: '-6s' },
  { points: '760,720 900,660 960,820 820,880', duration: '16s', delay: '-2s' },
  { points: '1280,560 1380,500 1440,620 1320,700', duration: '12s', delay: '-8s' },
  { points: '80,820 180,760 220,880 120,940', duration: '15s', delay: '-5s' },
  { points: '900,300 1000,260 1040,360 940,400', duration: '10s', delay: '-7s' },
  { points: '600,140 680,100 720,180 640,220', duration: '17s', delay: '-4s' },
]

export default function BackgroundFX() {
  return (
    <div className="background-fx" aria-hidden="true">
      <svg
        className="background-fx__svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {polygons.map((polygon, i) => (
          <polygon
            key={polygon.points}
            className="background-fx__polygon"
            points={polygon.points}
            style={{
              animationDuration: polygon.duration,
              animationDelay: polygon.delay,
            }}
          />
        ))}
      </svg>
    </div>
  )
}
