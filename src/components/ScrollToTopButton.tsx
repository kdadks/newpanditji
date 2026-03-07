'use client'

import { useEffect, useState } from 'react'

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  // WhatsApp icon: mobile bottom-4(16px)+h-10(40px)+2px gap = 58px
  //                sm     bottom-6(24px)+h-12(48px)+2px gap = 74px
  //                md     bottom-6(24px)+h-14(56px)+2px gap = 82px
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className="fixed bottom-[58px] right-4 z-40 sm:bottom-[74px] sm:right-6 md:bottom-[82px]
        w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
        transition-transform hover:scale-110 bg-transparent border-none p-0 cursor-pointer"
    >
      <img
        src="/images/backtotop.png"
        alt="Scroll to top"
        className="w-full h-full drop-shadow-lg"
      />
    </button>
  )
}
