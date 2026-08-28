'use client'

import { useRouter } from 'next/navigation'
import { Modal, ModalHeader, ModalBody } from '@/components/ui/modal'

export function FormModal({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleClose = () => {
    onClose()
    router.refresh()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalHeader title={title} description={description} onClose={handleClose} />
      <ModalBody>{children}</ModalBody>
    </Modal>
  )
}
