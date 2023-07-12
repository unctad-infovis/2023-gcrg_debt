import React, {
  useContext, useRef, useState, useLayoutEffect
} from 'react';

// context
import Data from '../context/StaticData.js';
import Metric_Context from '../context/Metric.js';
import viewPort from '../helpers/viewPort';

function About() {
  const { aboutData } = useContext(Data);
  const { metric } = useContext(Metric_Context);
  const text = aboutData.data.find((d) => d.id === metric);

  const p = text.text.replaceAll('<p>', '').split('</p>');

  const ref = useRef(null);
  const [figureWidth, setWidth] = useState(0);
  const [figureHeight, setHeight] = useState(0);

  const { width, height } = viewPort();

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
  }, [width, height]);

  return (
    <div className="about" ref={ref}>
      <div
        className="about-content"
        style={{ width: figureWidth, height: figureHeight }}
      >
        <div className="desc">
          {p.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="source">
          <b>Source</b>
          <p>{text.source}</p>
        </div>
      </div>
    </div>
  );
}

export default About;
