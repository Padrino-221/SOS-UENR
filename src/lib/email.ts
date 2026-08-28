import { Resend } from 'resend'
import { readFileSync } from 'fs'
import { join } from 'path'

const resend = new Resend(process.env.RESEND_API_KEY)

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'School of Sciences <noreply@sciences.uenr.edu.gh>'

const DARK = '#0f172a'
const MUTED = '#64748b'
const SURFACE = '#ffffff'
const PAGE_BG = '#f1f5f9'
const BORDER = '#e2e8f0'
const FONT = "'Radio Canada Big',Arial,Helvetica,sans-serif"

function loadPng(name: string): string {
  const buf = readFileSync(join(process.cwd(), 'public', 'email-images', `${name}.png`))
  return `data:image/png;base64,${buf.toString('base64')}`
}

let _images: Record<string, string> | null = null
function getImages() {
  if (!_images) {
    _images = {
      heroSetPassword: loadPng('hero-set-password'),
      heroWelcome: loadPng('hero-welcome'),
      heroAccessRemoved: loadPng('hero-access-removed'),
      btnSetPassword: loadPng('btn-set-password'),
      btnWelcome: loadPng('btn-welcome'),
    }
  }
  return _images
}

function emailTemplate({ heroImg, body }: {
  heroImg: string
  body: string
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light only" />
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, h1, h2, h3 { font-family:Arial,Helvetica,sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background:${PAGE_BG};font-family:${FONT};color:${DARK};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:${PAGE_BG};padding:24px 12px;font-family:${FONT};">
    <tr>
      <td align="center" style="font-family:${FONT};">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="email-card" style="width:100%;max-width:560px;background:${SURFACE};border-radius:16px;overflow:hidden;border:1px solid ${BORDER};font-family:${FONT};">

          <!-- Hero Image -->
          <tr>
            <td style="padding:0;font-family:${FONT};">
              <img src="${heroImg}" alt="" width="560" style="display:block;width:100%;height:auto;border:0;font-family:${FONT};" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px 32px 26px;font-size:16px;line-height:1.7;color:${DARK};word-break:break-word;font-family:${FONT};">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 32px 28px;font-family:${FONT};">
              <div style="height:1px;background:${BORDER};margin-bottom:18px;font-family:${FONT};"></div>
              <p style="margin:0;font-size:12px;line-height:1.6;color:${MUTED};font-family:${FONT};">School of Sciences &middot; University of Energy and Natural Resources, Sunyani, Ghana</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendSpmsAccessEmail({
  name,
  email,
  token,
}: {
  name: string
  email: string
  token: string
}) {
  const url = `${SITE_URL}/spms/set-password?token=${token}`

  const body = `
    <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:${DARK};font-family:${FONT};">Hi ${name},</p>
    <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:${DARK};font-family:${FONT};">You've been granted access to the <strong>Student Project Management System</strong> (SPMS). Set your password below to activate your account.</p>

    <!-- Steps -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;font-family:${FONT};">
      <tr>
        <td style="padding:8px 0;vertical-align:top;width:32px;font-family:${FONT};">
          <span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;border-radius:50%;background:#0D2063;color:#ffffff;font-size:11px;font-weight:700;font-family:${FONT};">1</span>
        </td>
        <td style="padding:8px 0 8px 10px;font-size:14px;color:${DARK};line-height:1.6;font-family:${FONT};">Click the button below to go to the password page</td>
      </tr>
      <tr>
        <td style="padding:8px 0;vertical-align:top;width:32px;font-family:${FONT};">
          <span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;border-radius:50%;background:#0D2063;color:#ffffff;font-size:11px;font-weight:700;font-family:${FONT};">2</span>
        </td>
        <td style="padding:8px 0 8px 10px;font-size:14px;color:${DARK};line-height:1.6;font-family:${FONT};">Create a strong, memorable password</td>
      </tr>
      <tr>
        <td style="padding:8px 0;vertical-align:top;width:32px;font-family:${FONT};">
          <span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;border-radius:50%;background:#0D2063;color:#ffffff;font-size:11px;font-weight:700;font-family:${FONT};">3</span>
        </td>
        <td style="padding:8px 0 8px 10px;font-size:14px;color:${DARK};line-height:1.6;font-family:${FONT};">Log in and start managing your projects</td>
      </tr>
    </table>

    <!-- CTA Button Image -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0;font-family:${FONT};">
      <tr>
        <td style="font-family:${FONT};">
          <a href="${url}" style="display:inline-block;font-family:${FONT};"><img src="${getImages().btnSetPassword}" alt="Set Your Password" width="240" style="display:block;border:0;font-family:${FONT};" /></a>
        </td>
      </tr>
    </table>

    <p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:${MUTED};font-family:${FONT};">This link expires in 48 hours. If you did not expect this email, you can safely ignore it.</p>
  `

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'SPMS Access \u2014 Set Your Password',
    html: emailTemplate({
      heroImg: getImages().heroSetPassword,
      body,
    }),
  })
}

export async function sendSpmsAccessRevokedEmail({
  name,
  email,
}: {
  name: string
  email: string
}) {
  const body = `
    <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:${DARK};font-family:${FONT};">Hi ${name},</p>
    <p style="margin:0;font-size:16px;line-height:1.7;color:${DARK};font-family:${FONT};">Your access to the <strong>Student Project Management System</strong> (SPMS) has been removed. You will no longer be able to log in.</p>
    <p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:${MUTED};font-family:${FONT};">If you believe this was a mistake, please contact your administrator.</p>
  `

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'SPMS Access Removed',
    html: emailTemplate({
      heroImg: getImages().heroAccessRemoved,
      body,
    }),
  })
}
