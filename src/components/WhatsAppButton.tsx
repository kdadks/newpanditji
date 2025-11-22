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
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-[#25D366] hover:bg-[#20BA5A] text-white p-0"
      >
        <svg
          viewBox="0 0 32 32"
          fill="currentColor"
          className="w-8 h-8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.002 0h-.004C7.164 0 0 7.164 0 16c0 3.5 1.128 6.744 3.042 9.378L1.05 30.624l5.418-1.948A15.932 15.932 0 0016.002 32C24.836 32 32 24.836 32 16S24.836 0 16.002 0zm9.49 22.64c-.392 1.108-2.318 2.03-3.194 2.17-.746.12-1.718.216-2.792-.176-.65-.234-1.484-.546-2.55-1.07-4.458-2.19-7.37-6.692-7.59-7-.22-.308-1.796-2.39-1.796-4.56s1.138-3.234 1.54-3.676c.402-.442.876-.552 1.168-.552.292 0 .584.004.84.016.27.012.63-.102.984.75.364.876 1.244 3.034 1.352 3.254.108.22.18.476.036.768-.144.292-.216.476-.432.732-.216.256-.454.572-.648.768-.216.22-.44.458-.19.898.252.44 1.12 1.848 2.404 2.992 1.652 1.472 3.046 1.932 3.478 2.15.432.22.684.184.936-.11.252-.292 1.08-1.26 1.368-1.694.288-.434.576-.362.972-.22.396.144 2.516 1.186 2.948 1.402.432.216.72.324.824.504.108.18.108 1.036-.284 2.144z" />
        </svg>
      </Button>
    </a>
  )
}
