import { useContext, useLayoutEffect, useRef, useState } from 'react';

// context
import Metric_Context from '../context/Metric';
import Data from '../context/StaticData';

function About() {
  const { aboutData } = useContext(Data);
  const { metric } = useContext(Metric_Context);
  const text = aboutData.data.find(d => d.id === metric);

  const p = text.text.replaceAll('<p>', '').split('</p>');

  const ref = useRef(null);
  const [figureWidth, setWidth] = useState(0);
  const [figureHeight, setHeight] = useState(0);

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
  }, []);

  return (
    <div className="about" ref={ref}>
      <div className="about-content" style={{ width: figureWidth, height: figureHeight }}>
        <div className="desc">
          {p.map(paragraph => (
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
