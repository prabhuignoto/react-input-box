import * as React from 'react';

function ChevronUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="prefix__feather prefix__feather-chevron-up"
      {...props}
    >
      <path d="M18 15l-6-6-6 6" />
    </svg>
  );
}

export default ChevronUp;
