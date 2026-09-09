import { useMemo } from 'react';
import qrcode from 'qrcode-generator';

/**
 * Renders a QRIS payload as a scannable code.
 *
 * The panel hands us the raw EMV payload string, which is meaningless to a
 * customer as text — it only becomes payable once it is a QR a wallet app can
 * scan. Drawn as SVG rects so it stays crisp at any size and needs no canvas.
 *
 * Always dark-on-white regardless of theme: scanners need that contrast, and
 * an inverted QR fails to read on many Android wallet apps.
 */
export function QrCode({
  value,
  size = 210,
  label,
}: {
  value: string;
  size?: number;
  label?: string;
}) {
  const path = useMemo(() => {
    try {
      // Type 0 auto-sizes to the payload; M is the error correction level
      // QRIS specifies.
      const qr = qrcode(0, 'M');
      qr.addData(value);
      qr.make();
      const count = qr.getModuleCount();
      const parts: string[] = [];
      for (let row = 0; row < count; row++) {
        for (let col = 0; col < count; col++) {
          if (qr.isDark(row, col)) parts.push(`M${col} ${row}h1v1h-1z`);
        }
      }
      return { d: parts.join(''), count };
    } catch {
      // An over-long or malformed payload cannot be encoded; the caller falls
      // back to showing the string.
      return null;
    }
  }, [value]);

  if (!path) return null;

  const quiet = 2; // margin in modules, required by the QR spec for scanning
  const box = path.count + quiet * 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${box} ${box}`}
      role="img"
      aria-label={label ?? 'Kode QR pembayaran'}
      style={{ borderRadius: 12, background: '#fff', display: 'block' }}
      shapeRendering="crispEdges"
    >
      <rect width={box} height={box} fill="#fff" />
      <g transform={`translate(${quiet} ${quiet})`}>
        <path d={path.d} fill="#000" />
      </g>
    </svg>
  );
}
