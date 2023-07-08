import React, { useContext } from 'react';

// context
import Data from '../context/StaticData.js';
import Metric_Context from '../context/Metric.js';

function About() {
  const { aboutData } = useContext(Data);
  const { metric } = useContext(Metric_Context);
  const text = aboutData.data.find((d) => d.id === metric);

  const p = text.text.replaceAll('<p>', '').split('</p>');

  return (
    <div className="about">
      <div className="desc">
        {p.map((paragraph) => (
          <p>
            {' '}
            {paragraph}
            {' '}
          </p>
        ))}
      </div>

      <div className="source">
        <b>Source</b>
        <p>{text.source}</p>
      </div>
    </div>
  );
}

export default About;
