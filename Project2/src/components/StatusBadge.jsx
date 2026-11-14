import React from 'react';

export default function StatusBadge({ status }) {
  const normalized = status ? status.toLowerCase() : 'scheduled';
  return (
    <span className={`badge badge-${normalized}`}>
      {status}
    </span>
  );
}

