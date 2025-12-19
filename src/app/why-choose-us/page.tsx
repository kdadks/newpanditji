'use client'

import { Suspense } from 'react'
import WhyChooseUsPage from '../../components/pages/WhyChooseUsPage'

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
)

export default function WhyChooseUs() {
  return (
    <Suspense fallback={<PageLoader />}>
      <WhyChooseUsPage />
    </Suspense>
  )
}