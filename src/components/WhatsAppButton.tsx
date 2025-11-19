import { WhatsappLogo } from '@phosphor-icons/react'
import { Button } from './ui/button'

export default function WhatsAppButton() {
  const phoneNumber = '+353123456789'
  const message = 'Namaste! I would like to inquire about your services.'
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40"
    >
      <Button
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-[#25D366] hover:bg-[#20BA5A] text-white"
      >
        <WhatsappLogo size={28} weight="fill" />
      </Button>
    </a>
  )
}
