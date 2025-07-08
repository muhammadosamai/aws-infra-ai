
import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    className="text-aws-orange"
  >
    <g>
      <circle cx="12" cy="3" r="1" fill="currentColor">
        <animate
          id="svgSpinners12DotsScale0"
          attributeName="r"
          begin="0;svgSpinners12DotsScale1.end-0.5s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".27,.42,.37,.99;.53,0,.61,.73"
          values="1;2;1"
        />
      </circle>
      <circle cx="16.5" cy="4.21" r="1" fill="currentColor">
        <animate
          attributeName="r"
          begin="svgSpinners12DotsScale0.begin+0.1s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".27,.42,.37,.99;.53,0,.61,.73"
          values="1;2;1"
        />
      </circle>
      <circle cx="19.79" cy="7.5" r="1" fill="currentColor">
        <animate
          attributeName="r"
          begin="svgSpinners12DotsScale0.begin+0.2s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".27,.42,.37,.99;.53,0,.61,.73"
          values="1;2;1"
        />
      </circle>
      <circle cx="21" cy="12" r="1" fill="currentColor">
        <animate
          attributeName="r"
          begin="svgSpinners12DotsScale0.begin+0.3s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".27,.42,.37,.99;.53,0,.61,.73"
          values="1;2;1"
        />
      </circle>
      <circle cx="19.79" cy="16.5" r="1" fill="currentColor">
        <animate
          attributeName="r"
          begin="svgSpinners12DotsScale0.begin+0.4s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".27,.42,.37,.99;.53,0,.61,.73"
          values="1;2;1"
        />
      </circle>
      <circle cx="16.5" cy="19.79" r="1" fill="currentColor">
        <animate
          attributeName="r"
          begin="svgSpinners12DotsScale0.begin+0.5s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".27,.42,.37,.99;.53,0,.61,.73"
          values="1;2;1"
        />
      </circle>
      <circle cx="12" cy="21" r="1" fill="currentColor">
        <animate
          id="svgSpinners12DotsScale1"
          attributeName="r"
          begin="svgSpinners12DotsScale0.begin+0.6s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".27,.42,.37,.99;.53,0,.61,.73"
          values="1;2;1"
        />
      </circle>
      <circle cx="7.5" cy="19.79" r="1" fill="currentColor">
        <animate
          attributeName="r"
          begin="svgSpinners12DotsScale1.begin+0.1s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".27,.42,.37,.99;.53,0,.61,.73"
          values="1;2;1"
        />
      </circle>
      <circle cx="4.21" cy="16.5" r="1" fill="currentColor">
        <animate
          attributeName="r"
          begin="svgSpinners12DotsScale1.begin+0.2s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".27,.42,.37,.99;.53,0,.61,.73"
          values="1;2;1"
        />
      </circle>
      <circle cx="3" cy="12" r="1" fill="currentColor">
        <animate
          attributeName="r"
          begin="svgSpinners12DotsScale1.begin+0.3s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".27,.42,.37,.99;.53,0,.61,.73"
          values="1;2;1"
        />
      </circle>
      <circle cx="4.21" cy="7.5" r="1" fill="currentColor">
        <animate
          attributeName="r"
          begin="svgSpinners12DotsScale1.begin+0.4s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".27,.42,.37,.99;.53,0,.61,.73"
          values="1;2;1"
        />
      </circle>
      <circle cx="7.5" cy="4.21" r="1" fill="currentColor">
        <animate
          attributeName="r"
          begin="svgSpinners12DotsScale1.begin+0.5s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".27,.42,.37,.99;.53,0,.61,.73"
          values="1;2;1"
        />
      </circle>
    </g>
  </svg>
);
