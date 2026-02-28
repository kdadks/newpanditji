import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const RECIPIENT_EMAIL = 'amit.ranjan78@gmail.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, service, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    const serviceLabel =
      service === 'general' ? 'General Inquiry' :
      service === 'pooja' ? 'Pooja Ceremony' :
      service === 'wedding' ? 'Wedding Ceremony' :
      service === 'funeral' ? 'Funeral Rites' :
      service === 'consultation' ? 'Spiritual Consultation' :
      service === 'other' ? 'Other' :
      'Not specified'

    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: [RECIPIENT_EMAIL],
      replyTo: email,
      subject: `New Contact Form Inquiry – ${serviceLabel}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #fff8f0; border-radius: 8px; border: 1px solid #f5deb3;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #b45309; margin: 0; font-size: 24px;">🙏 New Contact Form Inquiry</h1>
            <p style="color: #78716c; margin: 8px 0 0;">Received from newpanditji.vercel.app</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08);">
            <tr style="background: #fef3c7;">
              <td style="padding: 14px 18px; font-weight: bold; color: #92400e; width: 35%; border-bottom: 1px solid #fde68a;">Name</td>
              <td style="padding: 14px 18px; color: #1c1917; border-bottom: 1px solid #fde68a;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 14px 18px; font-weight: bold; color: #92400e; width: 35%; border-bottom: 1px solid #fde68a;">Email</td>
              <td style="padding: 14px 18px; border-bottom: 1px solid #fde68a;"><a href="mailto:${email}" style="color: #b45309;">${email}</a></td>
            </tr>
            <tr style="background: #fef3c7;">
              <td style="padding: 14px 18px; font-weight: bold; color: #92400e; width: 35%; border-bottom: 1px solid #fde68a;">Phone</td>
              <td style="padding: 14px 18px; color: #1c1917; border-bottom: 1px solid #fde68a;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 14px 18px; font-weight: bold; color: #92400e; width: 35%; border-bottom: 1px solid #fde68a;">Service Interest</td>
              <td style="padding: 14px 18px; color: #1c1917; border-bottom: 1px solid #fde68a;">${serviceLabel}</td>
            </tr>
            <tr style="background: #fef3c7;">
              <td style="padding: 14px 18px; font-weight: bold; color: #92400e; vertical-align: top;">Message</td>
              <td style="padding: 14px 18px; color: #1c1917; white-space: pre-wrap; line-height: 1.6;">${message}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding: 16px; background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px;">
            <p style="margin: 0; color: #78716c; font-size: 13px;">
              💡 You can reply directly to this email to respond to <strong>${name}</strong> at <strong>${email}</strong>.
            </p>
          </div>

          <p style="text-align: center; color: #a8a29e; font-size: 12px; margin-top: 24px;">
            This message was sent via the contact form on newpanditji.vercel.app
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}
