import React from 'react';

interface NavEditorialTitleProps {
  label: string;
}

export default function NavEditorialTitle({ label }: NavEditorialTitleProps) {
  return (
    <div className="nav-editorial-title" aria-hidden="true">
      <span className="nav-eyebrow-tag">Navigation</span>
      <h2 className="nav-editorial-heading">{label}</h2>
    </div>
  );
}
