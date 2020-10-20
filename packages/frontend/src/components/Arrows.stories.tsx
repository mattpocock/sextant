import React from "react";
import { getBoxToBoxArrow } from "perfect-arrows";

export default {
  title: "Components/Arrows",
};

export function PerfectArrow() {
  const p1 = { x: 64, y: 64, w: 64, h: 64 };
  const p2 = { x: 128, y: 96, w: 64, h: 64 };

  const arrow = getBoxToBoxArrow(
    p1.x,
    p1.y,
    p1.w,
    p1.h,
    p2.x,
    p2.y,
    p2.w,
    p2.h,
    {
      bow: 0.2,
      stretch: 0.5,
      stretchMin: 40,
      stretchMax: 420,
      padStart: 0,
      padEnd: 20,
      flip: false,
      straights: true,
    },
  );

  const [sx, sy, cx, cy, ex, ey, ae, as, ec] = arrow;

  const endAngleAsDegrees = ae * (180 / Math.PI);

  return (
    <svg
      viewBox="0 0 1280 720"
      style={{ width: 1280, height: 720 }}
      stroke="#000"
      strokeWidth={3}
    >
      <circle cx={sx} cy={sy} r={4} />
      <path d={`M${sx},${sy} Q${cx},${cy} ${ex},${ey}`} fill="none" />
      <polygon
        fill="transparent"
        points={`${p1.x},${p1.y} ${p1.w + p1.x},${p1.y} ${p1.w + p1.x},${p1.h +
          p1.y} ${p1.x},${p1.h + p1.y}`}
      ></polygon>
      <polygon
        fill="transparent"
        points={`${p2.x},${p2.y} ${p2.w + p2.x},${p2.y} ${p2.w + p2.x},${p2.h +
          p2.y} ${p2.x},${p2.h + p2.y}`}
      ></polygon>
      <polygon
        points="0,-6 12,0, 0,6"
        fill="#000"
        transform={`translate(${ex},${ey}) rotate(${endAngleAsDegrees})`}
      />
    </svg>
  );
}
