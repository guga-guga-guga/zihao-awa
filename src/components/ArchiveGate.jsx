export default function ArchiveGate({ onEnter }) {
  return (
    <div className="archive-gate">
      <div className="archive-gate__bg" aria-hidden="true">
        <svg viewBox="0 0 1920 1080" preserveAspectRatio="none">
          <g fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M-210 705C-45 705 182 704 247 567C337 377 99 306 4 435S27 680 169 631C309 584 227 314 279 111S568-113 568-113" />
            <path d="M1560-80C1374 114 1671 168 1601 323S1371 367 1431 480S1692 666 1559 787S1329 886 1498 1130" />
            <circle cx="1450" cy="648" r="346" />
            <circle cx="1450" cy="648" r="348" />
          </g>
        </svg>
      </div>

      <div className="archive-gate__inner">
        <h2 className="archive-gate__title">历史项目</h2>

        <p className="archive-gate__hint">图片资源 / 选择连接</p>

        <button type="button" className="archive-gate__button" onClick={onEnter}>
          <span>加载档案</span>
          <i aria-hidden="true">→</i>
        </button>
      </div>
    </div>
  )
}