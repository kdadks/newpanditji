import { useContactContent } from '@/hooks/useCmsContent'

export default function WhatsAppButton() {
  const { content: cmsContent } = useContactContent()

  const whatsappAction = cmsContent?.hero?.quickActions?.find(
    (action) => action.text?.toLowerCase().includes('whatsapp')
  )

  const whatsappUrl = whatsappAction?.link || '#'

  if (!whatsappAction?.link) return null

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-40 transition-transform hover:scale-110 sm:bottom-6 sm:right-6"
    >
      <img
        src="/images/whatsappicon.png"
        alt="Chat on WhatsApp"
        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 drop-shadow-lg"
      />
    </a>
  )
}
