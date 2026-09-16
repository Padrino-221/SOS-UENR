'use client'

import { useState } from 'react'
import { BookOpen, CaretDown, CaretRight, Lock, FolderOpen, UserCircle, PaperPlaneTilt, Gear, Megaphone, Question } from '@phosphor-icons/react'
import { PageHeader } from '@/components/ui'
import { cn } from '@/lib/utils'

interface Section {
  id: string
  title: string
  icon: React.ReactNode
  items: GuideItem[]
}

interface GuideItem {
  question: string
  answer: string | React.ReactNode
}

function GettingStartedGuide(): Section {
  return {
    id: 'getting-started',
    title: 'Getting Started',
    icon: <Lock size={18} weight="duotone" />,
    items: [
      {
        question: 'How do I log in?',
        answer: (
          <ol className="list-decimal list-inside space-y-1">
            <li>Go to <strong>sos-uenr.vercel.app/spms</strong></li>
            <li>Enter your email address and password</li>
            <li>Click <strong>Sign In</strong></li>
          </ol>
        ),
      },
      {
        question: 'How do I set my password for the first time?',
        answer: (
          <ol className="list-decimal list-inside space-y-1">
            <li>Check your email for the SPMS onboarding message</li>
            <li>Click the <strong>Set Your Password</strong> button in the email</li>
            <li>Create a strong, memorable password</li>
            <li>Click <strong>Save Password</strong></li>
          </ol>
        ),
      },
      {
        question: 'How do I change my password?',
        answer: (
          <ol className="list-decimal list-inside space-y-1">
            <li>Click <strong>Profile</strong> in the sidebar</li>
            <li>Scroll to the <strong>Change Password</strong> section</li>
            <li>Enter your current password and new password</li>
            <li>Click <strong>Update Password</strong></li>
          </ol>
        ),
      },
      {
        question: 'How do I edit my profile?',
        answer: (
          <ol className="list-decimal list-inside space-y-1">
            <li>Click <strong>Profile</strong> in the sidebar</li>
            <li>Update your name, title, phone, bio, or research areas</li>
            <li>Upload a profile photo (optional)</li>
            <li>Click <strong>Save Changes</strong></li>
          </ol>
        ),
      },
    ],
  }
}

function SupervisorGuide(): Section {
  return {
    id: 'supervisors',
    title: 'For Supervisors',
    icon: <FolderOpen size={18} weight="duotone" />,
    items: [
      {
        question: 'How do I create a new project?',
        answer: (
          <div className="space-y-2">
            <p>Project creation follows a 4-step wizard:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li><strong>Step 1 — Instructions:</strong> Read the formatting requirements and check the box to confirm</li>
              <li><strong>Step 2 — Document Upload:</strong> Upload your project document as a PDF file. You can drag and drop or click to browse</li>
              <li><strong>Step 3 — Project Details:</strong> Fill in the project topic, student names, programme, degree level, academic year, GitHub link, abstract, and objective</li>
              <li><strong>Step 4 — Confirmation:</strong> Review all details and click <strong>Submit Project</strong></li>
            </ol>
          </div>
        ),
      },
      {
        question: 'What are the PDF document requirements?',
        answer: (
          <ul className="list-disc list-inside space-y-1">
            <li>First page must include: Project Topic, Student Name(s), Programme, Degree Level, Academic Year, Supervisor, Abstract, Objective</li>
            <li>File name format: <code className="bg-ink-50 px-1.5 py-0.5 rounded text-xs font-mono">AcademicYear_Project Topic.pdf</code></li>
            <li>Example: <code className="bg-ink-50 px-1.5 py-0.5 rounded text-xs font-mono">2024-2025_Design of Smart Irrigation System.pdf</code></li>
            <li>Upload your project to GitHub and paste the repository link in Step 3</li>
          </ul>
        ),
      },
      {
        question: 'How do I edit an existing project?',
        answer: (
          <ol className="list-decimal list-inside space-y-1">
            <li>Go to <strong>Projects</strong> in the sidebar</li>
            <li>Find the project you want to edit</li>
            <li>Click the <strong>Edit</strong> button (you can only edit your own projects)</li>
            <li>Make your changes and click <strong>Update Project</strong></li>
          </ol>
        ),
      },
      {
        question: 'How do I view project records?',
        answer: (
          <ol className="list-decimal list-inside space-y-1">
            <li>Click <strong>Records</strong> in the sidebar</li>
            <li>Select an academic year to view all projects for that year</li>
            <li>Use the search bar to find specific projects</li>
          </ol>
        ),
      },
    ],
  }
}

function AdminGuide(): Section {
  return {
    id: 'admins',
    title: 'For Admins',
    icon: <Gear size={18} weight="duotone" />,
    items: [
      {
        question: 'How do I manage academic years?',
        answer: (
          <ol className="list-decimal list-inside space-y-1">
            <li>Go to <strong>Settings</strong> in the sidebar (admin only)</li>
            <li>Click <strong>Add Year</strong> and enter the year range (e.g. "2024/2025")</li>
            <li>Click the star icon to set the active year</li>
            <li>Use the delete button to remove unused years</li>
          </ol>
        ),
      },
      {
        question: 'How do I send announcements?',
        answer: (
          <ol className="list-decimal list-inside space-y-1">
            <li>Go to <strong>Announcements</strong> in the sidebar (admin only)</li>
            <li>Enter a subject and message body</li>
            <li>Click <strong>Send Announcement</strong></li>
            <li>The email will be sent to all staff with SPMS access</li>
          </ol>
        ),
      },
      {
        question: 'How do I grant SPMS access to a staff member?',
        answer: (
          <ol className="list-decimal list-inside space-y-1">
            <li>Go to the main site admin panel at <strong>/admin/staff</strong></li>
            <li>Edit the staff member&apos;s profile</li>
            <li>Toggle <strong>SPMS Access</strong> to ON</li>
            <li>The staff member will receive an onboarding email with a password setup link</li>
          </ol>
        ),
      },
    ],
  }
}

function FAQSection(): Section {
  return {
    id: 'faq',
    title: 'Frequently Asked Questions',
    icon: <Question size={18} weight="duotone" />,
    items: [
      {
        question: 'My password link expired. What do I do?',
        answer: (
          <p>Contact your administrator to re-enable your SPMS access. They can toggle it off and on again in the admin panel, which will send you a new onboarding email with a fresh link.</p>
        ),
      },
      {
        question: 'I can\'t log in. What should I check?',
        answer: (
          <ul className="list-disc list-inside space-y-1">
            <li>Make sure you&apos;re using the email address registered in the system</li>
            <li>Check that your password is correct (case-sensitive)</li>
            <li>Ensure you have SPMS access — contact your admin if unsure</li>
            <li>If you haven&apos;t set your password yet, check your email for the onboarding link</li>
          </ul>
        ),
      },
      {
        question: 'Who is my supervisor?',
        answer: (
          <p>Your supervisor is assigned by the administrator. Check your project details or contact your department head to find out who your supervisor is.</p>
        ),
      },
      {
        question: 'Can I change my programme?',
        answer: (
          <p>Contact your administrator to update your programme assignment. This is managed in the admin panel under staff management.</p>
        ),
      },
      {
        question: 'How do I submit a project?',
        answer: (
          <div className="space-y-1">
            <p>Go to <strong>Projects</strong> &rarr; <strong>New Project</strong> and follow the 4-step wizard. See the <strong>For Supervisors</strong> section above for detailed instructions.</p>
          </div>
        ),
      },
      {
        question: 'Can I save my progress and continue later?',
        answer: (
          <p>Yes. When creating a new project, your progress is automatically saved as a draft. When you return, you&apos;ll be prompted to restore your draft or start fresh.</p>
        ),
      },
    ],
  }
}

function AccordionItem({ item, isOpen, onToggle }: { item: GuideItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-ink-100 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-ink-800 hover:bg-ink-50 transition"
      >
        <span>{item.question}</span>
        {isOpen ? (
          <CaretDown size={14} weight="duotone" className="shrink-0 text-ink-400" />
        ) : (
          <CaretRight size={14} weight="duotone" className="shrink-0 text-ink-400" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-sm text-ink-600 leading-relaxed border-t border-ink-50">
          <div className="pt-3">{item.answer}</div>
        </div>
      )}
    </div>
  )
}

export function ManualClient({ isAdmin }: { isAdmin: boolean }) {
  const allSections = [GettingStartedGuide(), SupervisorGuide(), FAQSection()]
  if (isAdmin) allSections.splice(2, 0, AdminGuide())

  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  function toggleItem(sectionId: string, question: string) {
    setOpenItems((prev) => {
      const key = `${sectionId}:${question}`
      return { ...prev, [key]: !prev[key] }
    })
  }

  return (
    <div>
      <PageHeader
        title="SPMS User Manual"
        description="Step-by-step guides and frequently asked questions for using the Student Project Management System."
      />

      <div className="space-y-8 max-w-3xl">
        {allSections.map((section) => (
          <div key={section.id} className="rounded-xl border border-ink-100 bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-brand-700">{section.icon}</span>
              <h2 className="text-base font-bold text-ink-900">{section.title}</h2>
            </div>
            <div className="space-y-2">
              {section.items.map((item) => (
                <AccordionItem
                  key={item.question}
                  item={item}
                  isOpen={!!openItems[`${section.id}:${item.question}`]}
                  onToggle={() => toggleItem(section.id, item.question)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
