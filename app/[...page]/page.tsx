import { builder } from '@builder.io/sdk';
import { RenderBuilderContent } from '@/components/builder';
import { notFound } from 'next/navigation';

builder.init('2fb19aaf0dcf4690970b30a8d97097ea');

// Update the interface to match Next.js 15 types
interface PageProps {
  params: Promise<{
    page: string[];
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 500;

export default async function Page({ params, searchParams }: PageProps) {
  const builderModelName = 'page';

  // Await both params and searchParams
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);

  const pagePath = resolvedParams?.page ? `/${resolvedParams.page.join('/')}` : '/';

  // Check if we're in Builder's visual editor
  const isBuilderPreview = Boolean(resolvedSearchParams?.['builder.preview']);

  const content = await builder
    .get('page', {
      url: pagePath,
      options: {
        enrich: true,
      },
    })
    .promise();

  // Only show 404 if we're not in preview mode
  if (!content && !isBuilderPreview) {
    notFound();
  }

  return (
    <RenderBuilderContent content={content} model={builderModelName} options={{ enrich: true }} />
  );
}

// Force dynamic to ensure preview works
export const dynamic = 'force-dynamic';
