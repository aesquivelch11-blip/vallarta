import React from 'react';

interface NavEditorialTitleProps {
  label: string;
}

export default function NavEditorialTitle({ label }: NavEditorialTitleProps) {
  return (
    <div className="nav-editorial-title" aria-hidden="true">
      <h2 className="nav-editorial-heading">{label}</h2>
    </div>
  );
}
