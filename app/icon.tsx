import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

/**
 * Dynamic favicon / app icon generator.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: "#0B0D0E",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#63C7D9",
          fontWeight: 700,
          border: "1px solid #292D30",
          borderRadius: 4,
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
