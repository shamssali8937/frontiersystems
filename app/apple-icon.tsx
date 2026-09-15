import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

/**
 * Dynamic Apple touch icon generator.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 96,
          background: "#0B0D0E",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#63C7D9",
          fontWeight: 700,
          border: "2px solid #292D30",
          borderRadius: 24,
        }}
      >
        F
      </div>
    ),
    {
      ...size,
    },
  );
}
