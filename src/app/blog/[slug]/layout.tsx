// Server component that provides generateStaticParams for static export
export async function generateStaticParams() {
  // For static export with client-side data fetching,
  // we return a placeholder to satisfy the build requirement
  // The actual blog pages will be handled client-side
  return [{ slug: 'placeholder' }]
}

export default function BlogSlugLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
