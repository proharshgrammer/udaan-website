import React from 'react';

export default function ExamBadge({ exam }) {
  if (!exam) return null;
  return (
    <span className="inline-block bg-brand-light text-[#0C447C] text-xs font-medium px-3 py-1 rounded-full">
      {exam}
    </span>
  );
}
