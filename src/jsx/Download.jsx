import React, { useContext } from 'react';
import html2canvas from 'html2canvas';
import { FocusContext } from './context/Focus.js';

function Download() {
  const { id, comparisons } = useContext(FocusContext);

  const onClick = () => {
    const captureElement = document.querySelector(
      '#app-root-2023-gcrg_debt-download'
    );

    html2canvas(captureElement)
      .then((canvas) => {
        canvas.style.display = 'none';
        document.body.appendChild(canvas);
        return canvas;
      })
      .then((canvas) => {
        const image = canvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream');
        const a = document.createElement('a');
        a.setAttribute('download', 'DebtDashboard.png');
        a.setAttribute('href', image);
        a.click();
        canvas.remove();
      });
  };

  const c1 = comparisons[0]
    ? `&comparison1=${encodeURIComponent(comparisons[0].id)}`
    : '';
  const c2 = comparisons[1]
    ? `&comparison2=${encodeURIComponent(comparisons[1].id)}`
    : '';
  const url = `https://unctad.org/publication/world-of-debt/dashboard?id=${encodeURIComponent(
    id.id
  )}${c1}${c2}`;

  // https://unctad.org/publication/world-of-debt/dashboard?id=Low%20income%20countries&comparison1=Europe%20and%20Central%20Asia*&comparison2=Upper%20middle%20income%20countries

  return (
    <div className="debt-download-share">
      <div className="icon-link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-download"
          onClick={onClick}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
      </div>
      <div className="icon-link">
        <a
          href={`https://twitter.com/intent/tweet?text=UNCTAD%20World%20of%20Debt%20&source=sharethiscom&related=sharethis&url=${encodeURIComponent(
            url
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-twitter"
          >
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
          </svg>
        </a>
      </div>

      <div className="icon-link">
        <a
          href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(
            url
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-facebook"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </a>
      </div>

      <div className="icon-link">
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-linkedin"
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default Download;
