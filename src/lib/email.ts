import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

// Base URL for links inside emails. Explicitly avoid localhost so the
// SPMS set-password link always points at the deployed site.
const SITE_URL =
  process.env.EMAIL_SITE_URL ||
  (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
    ? process.env.NEXT_PUBLIC_SITE_URL
    : 'https://sos-uenr.vercel.app')
const FROM_EMAIL =
  process.env.SMTP_FROM || process.env.SMTP_USER || 'School of Sciences <sosuenr@gmail.com>'

let _transporter: Transporter | null = null

function getTransporter(): Transporter | null {
  if (_transporter) return _transporter

  const host = process.env.SMTP_HOST
  if (!host) {
    console.warn('[email] SMTP_HOST is not set — emails will not be sent')
    return null
  }

  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) {
    console.warn('[email] SMTP_USER/SMTP_PASS are missing — emails will not be sent')
    return null
  }

  _transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  })
  return _transporter
}

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */
const DARK = '#1a1a2e'
const MUTED = '#6b7280'
const SURFACE = '#ffffff'
const PAGE_BG = '#f3f4f6'
const BORDER = '#e5e7eb'
const ACCENT = '#2563eb'
const FONT = "Arial, Helvetica, sans-serif"

/* ------------------------------------------------------------------ */
/*  Shared email wrapper — clean card, no accent bars, no hero image   */
/* ------------------------------------------------------------------ */
function emailTemplate({ body }: { body: string }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background:${PAGE_BG};font-family:${FONT};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
    style="background:${PAGE_BG};padding:40px 16px;font-family:${FONT};">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
          style="max-width:560px;background:${SURFACE};border-radius:12px;border:1px solid ${BORDER};overflow:hidden;font-family:${FONT};">

          <!-- Body -->
          <tr>
            <td style="padding:40px 36px 36px;font-family:${FONT};">
              ${body}
            </td>
          </tr>

        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
          style="max-width:560px;font-family:${FONT};">
          <tr>
            <td style="padding:20px 0 0;text-align:center;font-family:${FONT};">
              <p style="margin:0;font-size:12px;line-height:1.6;color:${MUTED};font-family:${FONT};">
                &copy; ${new Date().getFullYear()} School of Sciences &middot; University of Energy and Natural Resources, Sunyani
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`
}

/* ------------------------------------------------------------------ */
/*  sendSpmsAccessEmail — onboarding / set-password                    */
/* ------------------------------------------------------------------ */
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
  const displayName = name.trim().toUpperCase()

  const body = `
    <p style="margin:0 0 20px;font-size:18px;font-weight:700;color:${DARK};font-family:${FONT};">Hello, ${displayName},</p>

    <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:${DARK};font-family:${FONT};">
      Your account has been successfully created for the <strong>Student Project Management System (SPMS)</strong>.
    </p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${DARK};font-family:${FONT};">
      Kindly find your account details below:
    </p>

    <p style="margin:0 0 6px;font-size:15px;line-height:1.7;color:${DARK};font-family:${FONT};"><strong>Username:</strong> ${email}</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:${DARK};font-family:${FONT};">Click the button below to set your password and activate your account.</p>

    <!-- CTA Button -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 28px;font-family:${FONT};">
      <tr>
        <td align="center" bgcolor="${ACCENT}" style="border-radius:8px;font-family:${FONT};">
          <a href="${url}" target="_blank"
            style="display:inline-block;padding:13px 32px;font-family:${FONT};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
            Set Your Password
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:${MUTED};font-family:${FONT};">
      If you have any questions, feel free to contact our support team.
    </p>

    <p style="margin:0;font-size:15px;line-height:1.7;color:${DARK};font-family:${FONT};">Thank you,<br/>
      <strong style="font-family:${FONT};">School of Sciences &mdash; Support Team</strong>
    </p>
  `

  const transporter = getTransporter()
  if (!transporter) throw new Error('Email service not configured (SMTP_* env vars missing)')
  await transporter.sendMail({
    from: FROM_EMAIL,
    to: email,
    subject: 'SPMS Access \u2014 Set Your Password',
    html: emailTemplate({ body }),
  })
}

/* ------------------------------------------------------------------ */
/*  sendSpmsAccessRevokedEmail — access removed notification           */
/* ------------------------------------------------------------------ */
export async function sendSpmsAccessRevokedEmail({
  name,
  email,
}: {
  name: string
  email: string
}) {
  const displayName = name.trim().toUpperCase()

  const body = `
    <p style="margin:0 0 20px;font-size:18px;font-weight:700;color:${DARK};font-family:${FONT};">Hello, ${displayName},</p>

    <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:${DARK};font-family:${FONT};">
      Your access to the <strong>Student Project Management System (SPMS)</strong> has been removed. You will no longer be able to log in.
    </p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:${MUTED};font-family:${FONT};">
      If you believe this was a mistake, please contact your administrator.
    </p>

    <p style="margin:0;font-size:15px;line-height:1.7;color:${DARK};font-family:${FONT};">Thank you,<br/>
      <strong style="font-family:${FONT};">School of Sciences &mdash; Support Team</strong>
    </p>
  `

  const transporter = getTransporter()
  if (!transporter) throw new Error('Email service not configured (SMTP_* env vars missing)')
  await transporter.sendMail({
    from: FROM_EMAIL,
    to: email,
    subject: 'SPMS Access Removed',
    html: emailTemplate({ body }),
  })
}

/* ------------------------------------------------------------------ */
/*  sendAnnouncementEmail — one-way broadcast to a single recipient    */
/* ------------------------------------------------------------------ */
export async function sendAnnouncementEmail({
  name,
  email,
  subject,
  body,
}: {
  name: string
  email: string
  subject: string
  body: string
}) {
  const displayName = name.trim()

  const htmlBody = `
    <p style="margin:0 0 20px;font-size:18px;font-weight:700;color:${DARK};font-family:${FONT};">Hello, ${displayName},</p>

    <div style="margin:0 0 24px;font-size:15px;line-height:1.7;color:${DARK};font-family:${FONT};">
      ${body}
    </div>

    <p style="margin:0;font-size:15px;line-height:1.7;color:${DARK};font-family:${FONT};">Thank you,<br/>
      <strong style="font-family:${FONT};">School of Sciences &mdash; Support Team</strong>
    </p>
  `

  const transporter = getTransporter()
  if (!transporter) throw new Error('Email service not configured (SMTP_* env vars missing)')
  await transporter.sendMail({
    from: FROM_EMAIL,
    to: email,
    subject,
    html: emailTemplate({ body: htmlBody }),
  })
}
