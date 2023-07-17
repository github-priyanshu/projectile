function calculateAngle(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const radians = Math.atan2(dy, dx);
  const degrees = radians * (180 / Math.PI);
  return degrees >= 0 ? degrees : (360 + degrees);
}