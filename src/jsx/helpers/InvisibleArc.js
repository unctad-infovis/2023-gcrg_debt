const firstArcSection = /(^.+?)L/;

const invisibleArc = (path, endAngle) => {
  const regex = firstArcSection.exec(path);
  let newArc = null;

  if (regex && regex[1]) {
    newArc = regex && regex[1] !== null ? regex[1].replace(/,/g, ' ') : null;

    if (endAngle > 3 && endAngle < 5) {
      const startLoc = /M(.*?)A/;
      const middleLoc = /A(.*?)0 0 1/;
      const endLoc = /0 0 1 (.*?)$/;
      const newStart = endLoc.exec(newArc)[1];
      const newEnd = startLoc.exec(newArc)[1];
      const middleSec = middleLoc.exec(newArc)[1];
      newArc = `M${newStart}A${middleSec}0 0 0 ${newEnd}`;
    }
  }
  return newArc;
};

export default invisibleArc;
