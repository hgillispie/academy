'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { PropsWithChildren } from 'react';

interface CollapsibleGroupProps {
  title: string;
  isExpandable: boolean;
  startExpanded?: boolean;
  breaker?: Map<string, string>;
}

export const CollapsibleCard = ({
  title,
  isExpandable = false,
  startExpanded = false,
  children,
}: PropsWithChildren<CollapsibleGroupProps>) => {
  // Initialize all groups as collapsed by default
  const [expanded, setExpanded] = useState<boolean>(startExpanded);
  const toggle = () => setExpanded(expanded => !expanded);

  const Head = isExpandable ? 'button' : 'div';

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Card header */}
      <Head
        className="w-full flex items-center justify-between p-4 bg-gray-50 text-left"
        onClick={() => isExpandable && toggle()}
      >
        <h3 className="text-lg font-medium">{title}</h3>
        {/* Expand/Collapse icon if Expandable */}
        {isExpandable ? (
          expanded ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )
        ) : null}
      </Head>
      {/* Card Content */}
      {(expanded || !isExpandable) && children}
    </div>
  );
};
