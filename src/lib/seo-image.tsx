import { ImageResponse } from "next/og";

export const socialImageSize = { width: 1200, height: 630 };

export function createSocialImage({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        color: "#18181b",
        background: "#fafafa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#52525b",
        }}
      >
        {eyebrow}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            display: "flex",
            maxWidth: 1020,
            fontSize: title.length > 64 ? 58 : 72,
            fontWeight: 700,
            lineHeight: 1.06,
            letterSpacing: "-0.045em",
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              display: "flex",
              maxWidth: 920,
              fontSize: 28,
              lineHeight: 1.4,
              color: "#52525b",
            }}
          >
            {description.slice(0, 150)}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "2px solid #e4e4e7",
          paddingTop: 24,
          fontSize: 22,
          color: "#71717a",
        }}
      >
        <span>parthsinha.com</span>
        <span>Projects · Engineering · Design</span>
      </div>
    </div>,
    socialImageSize,
  );
}
