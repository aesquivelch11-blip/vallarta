import React from 'react';

interface NavEditorialTitleProps {
  label: string;
  direction?: 'next' | 'prev';
}

export default function NavEditorialTitle({ label, direction = 'next' }: NavEditorialTitleProps) {
  return (
    <div className="nav-editorial-title" aria-hidden="true" data-direction={direction}>
      <h2 className="nav-editorial-heading">
        {label}
      </h2>
    </div>
  );
}

