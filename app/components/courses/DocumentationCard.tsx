'use client';

import { useMemo } from 'react';
import { BookText, ExternalLink, FileText, Link } from 'lucide-react';
import { useIsPreviewing } from '@builder.io/react';
import { DocumentItem } from '@/types/builder';
import { CollapsibleCard } from '../common/CollapsibleCard';

/**
 * Dynamically generates a documentation section based on the provided document items, using group names derived from the URL.
 */
export function AutoDocumentationSection({ docs }: { docs: DocumentItem[] }) {
  const isPreviewing = useIsPreviewing();
  // Negligible performance improvement, but still good practice
  const memoizedNamesFromUrl = useMemo(() => memoizedFunc(getMeaningfulNamesFromUrl), []);

  if (!docs && isPreviewing) return <h3>Add Document Links!</h3>;

  // Group documents by category (derived from URL pattern)
  const groupedDocs: Record<string, DocumentItem[]> = {};

  docs?.forEach(doc => {
    const url = doc.url || doc.doc;

    // Attempt to extract a meaningful group name from the URL
    const { title, anchorTitle } = memoizedNamesFromUrl(url);
    const group = anchorTitle && title ? title : 'General';
    if (!groupedDocs[group]) {
      groupedDocs[group] = [];
    }

    // Generate a title from the URL if not provided
    const docTitle = doc.linkText || anchorTitle || title;
    const description = doc.description || 'Learn more about this topic';

    groupedDocs[group].push({
      ...doc,
      linkText: docTitle,
      description,
    });
  });

  return (
    <div className="mb-12">
      <div className="space-y-6">
        {Object.entries(groupedDocs).map(([group, docs]) => (
          <DocumentsCard docs={docs} title={group} key={group} />
        ))}
      </div>
    </div>
  );
}

function kebabToReadable(text: string) {
  return text
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// reduce the number of calls to the function by memoizing the results
function memoizedFunc<Args extends unknown[], Result>(
  func: (...args: Args) => Result,
): (...args: Args) => Result {
  const cache = new Map();

  return function (...args: Args): Result {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}

function getMeaningfulNamesFromUrl(url: string) {
  // Attempt to extract meaningful names from the URL
  const response: { title?: string; anchorTitle?: string } = {};

  // split without a hash will return the original string as the first element
  const [path, anchor] = url?.split('#') ?? [];
  const mainPart = path?.split('/').pop() ?? '';

  if (mainPart) {
    response.title = kebabToReadable(mainPart);
  }
  if (anchor) response.anchorTitle = kebabToReadable(anchor.replace(/\.[^/.]+$/, ''));

  return response;
}

interface DocumentsCardProps {
  docs: DocumentItem[];
  title: string;
  isExpandable?: boolean;
  startExpanded?: boolean;
}

/**
 * A resusable Docs Links component, explicitly defined for each doc input and group title
 */
export const DocumentsCard = ({
  docs = [],
  title,
  isExpandable = true,
  startExpanded = true,
}: DocumentsCardProps) => {
  const isPreviewing = useIsPreviewing();
  return (
    <CollapsibleCard title={title} {...{ isExpandable, startExpanded }}>
      {/* Document items */}
      <div className="divide-y divide-gray-100">
        {docs.length > 0 &&
          docs.map((doc, index) => (
            <DocumentLink key={`${doc.url}-${doc.linkText}-${index}`} doc={doc} />
          ))}
        {isPreviewing && docs.length === 0 && (
          <div className="p-4">
            <p className="text-gray-500">Add Documents</p>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

// Generate a document icon based on type or URL
const DocIcon = ({ docType }: { docType: DocumentItem['docType'] }) => {
  if (docType === 'api') return <FileText className="w-5 h-5 text-blue-500" />;
  if (docType === 'tutorial') return <FileText className="w-5 h-5 text-green-500" />;
  if (docType === 'reference') return <BookText className="w-5 h-5 text-purple-500" />;

  // Default icon
  return <Link className="w-5 h-5 text-gray-500" />;
};

export const DocumentLink = ({ doc }: { doc: DocumentItem }) => {
  return (
    <a
      href={doc.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start">
        <div className="mr-3 mt-1">
          <DocIcon docType={doc.docType}></DocIcon>
        </div>
        <div className="flex-1">
          <div className="flex items-center">
            <h4 className="font-medium text-purple-700">{doc.linkText}</h4>
            <ExternalLink className="w-4 h-4 text-gray-400 ml-2" />
          </div>
          {doc.description && <p className="text-sm text-gray-600 mt-1">{doc.description}</p>}
        </div>
      </div>
    </a>
  );
};
