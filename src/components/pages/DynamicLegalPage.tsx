'use client'

import { useLegalPage } from '../../hooks/useLegalPages'
import { sanitizeHTML } from '../../utils/sanitize'

interface DynamicLegalPageProps {
  slug: string
}

export default function DynamicLegalPage({ slug }: DynamicLegalPageProps) {
  const { content, isLoading } = useLegalPage(slug)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-linear-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  if (!content.isPublished) {
    return (
      <div className="min-h-screen bg-linear-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Available</h1>
          <p className="text-gray-600">This page is currently being updated.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {content.title}
          </h1>
          {content.metaDescription && (
            <p className="text-lg text-gray-600">
              {content.metaDescription}
            </p>
          )}
        </div>

        {/* Page Content */}
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          {content.sections.map((section, index) => (
            <div key={index} className={index > 0 ? 'mt-8' : ''}>
              {section.title && (
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>
              )}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(section.content) }}
              />
            </div>
          ))}
        </div>

        {/* Last Updated */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}
