import React, { useContext } from 'react';
import html2canvas from 'html2canvas';
import { FocusContext } from './context/Focus.js';

function Download() {
  const { id, comparisons } = useContext(FocusContext);

  const shareButton = (event) => {
    const specs = `top=${(window.screen.height / 2) - (420 / 2)},left=${(window.screen.width / 2) - (550 / 2)},toolbar=0,status=0,width=550,height=420`;
    window.open(event.currentTarget.href, 'Jaa', specs);
    event.preventDefault();
  };

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
        <a
          aria-label="Share on Facebook"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          rel="noopener noreferrer"
          target="_blank"
          onClick={(event) => shareButton(event)}
        >
          <svg
            height="24"
            viewBox="0 0 165.36 298.41"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Layer_2" data-name="Layer 2">
              <g>
                <path
                  d="M136.45,53.37l28.91.75V1.5L122.52,0A72.91,72.91,0,0,0,49.61,72.91v46.6H0v56.38H49.61V298.41H112V175.89h44.34l9-56.38H112V77.82A24.45,24.45,0,0,1,136.45,53.37Z"
                  fill="#ded9d5"
                />
              </g>
            </g>
          </svg>
        </a>
      </div>

      <div className="icon-link">
        <a
          aria-label="Share on Twitter"
          href={`https://twitter.com/share?text=${encodeURIComponent('UN Trade and Development (UNCTAD): World of Debt')}&hashtags=${encodeURIComponent('unctad')}&url=${encodeURIComponent(url)}`}
          rel="noopener noreferrer"
          onClick={(event) => shareButton(event)}
        >
          <svg
            height="24"
            viewBox="0 0 317.5 301.21"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Layer_2" data-name="Layer 2">
              <g>
                <path
                  d="M317,297,188.48,125.6,300.62,4.41A2.63,2.63,0,0,0,298.69,0H278.6a5.4,5.4,0,0,0-4,1.73l-98.9,106.88L96,2.16A5.4,5.4,0,0,0,91.63,0h-89A2.63,2.63,0,0,0,.53,4.2L122.18,166.49,1.6,296.8a2.63,2.63,0,0,0,1.93,4.41H23.62a5.4,5.4,0,0,0,4-1.73l107.34-116,86.63,115.57a5.4,5.4,0,0,0,4.32,2.16h89A2.63,2.63,0,0,0,317,297ZM83.51,21.64,276.86,279.57H234L40.64,21.64Z"
                  fill="#ded9d5"
                />
              </g>
            </g>
          </svg>
        </a>
      </div>

      <div className="icon-link">
        <a
          aria-label="Share on LinkedIn"
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`}
          rel="noopener noreferrer"
          onClick={(event) => shareButton(event)}
        >
          <svg
            aria-label="Share on LinkedIn"
            height="24"
            viewBox="0 0 301.82 301.14"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Layer_2" data-name="Layer 2">
              <g>
                <rect
                  fill="#ded9d5"
                  height="200.21"
                  width="63.16"
                  x="4.29"
                  y="100.94"
                />
                <circle
                  cx="36.35"
                  cy="36.35"
                  fill="#ded9d5"
                  r="36.35"
                  transform="matrix(0.95, -0.3, 0.3, 0.95, -9.27, 12.66)"
                />
                <path
                  d="M230.32,95c-48.86,0-62.77,33.37-62.77,33.37V100.94H106.78v200.2h63.16V196.27c0-14.3,4.37-46.47,36.94-46.47s32.57,37.73,32.57,37.73V301.14h62.37V182.37C301.82,126,279.18,95,230.32,95Z"
                  fill="#ded9d5"
                />
              </g>
            </g>
          </svg>
        </a>
      </div>

      <div className="icon-link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300.84 292.78"
          height="24"
          width="24"
          onClick={onClick}
        >
          <g id="Layer_2" data-name="Layer 2">
            <g>
              <line
                className="cls-1"
                x1="15.5"
                y1="277.28"
                x2="285.34"
                y2="277.28"
                stroke="#dadada"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="31px"
              />
              <path
                fill="#ded9d5"
                d="M180.48,115.83V9.51A9.51,9.51,0,0,0,171,0H116.32a9.51,9.51,0,0,0-9.51,9.51V115.83H74.14A9.51,9.51,0,0,0,67,131.61l69.51,79.27a9.5,9.5,0,0,0,14.29,0l69.51-79.27a9.51,9.51,0,0,0-7.15-15.78Z"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default Download;
