import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'
import { useState } from 'react'
import Modal from '../components/Modal'

// Modal needs controlled state — wrap it in a stateful parent for each story
function ModalWrapper({
  defaultOpen = false,
  title = 'Confirm Action',
  children,
}: {
  defaultOpen?: boolean
  title?: string
  children?: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="p-8 min-h-40 flex flex-col items-start gap-4">
      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
      >
        Open Modal
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        {children ?? (
          <>
            <p className="mb-5">Are you sure you want to proceed? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                Confirm
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

const meta: Meta<typeof ModalWrapper> = {
  title: 'Components/Modal',
  component: ModalWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ModalWrapper>

// Closed — only the trigger button is visible
export const Closed: Story = {
  args: { defaultOpen: false },
}

// Already open when story loads
export const Open: Story = {
  args: { defaultOpen: true },
}

// Open with a form inside to demonstrate focus trap
export const WithForm: Story = {
  args: {
    defaultOpen: true,
    title: 'Create Account',
  },
  render: (args) => (
    <ModalWrapper {...args}>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Alice Johnson"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            type="email"
            placeholder="alice@example.com"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium">
            Submit
          </button>
        </div>
      </form>
    </ModalWrapper>
  ),
}

// Open → close via Escape key
export const CloseWithEscape: Story = {
  args: { defaultOpen: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Open Modal' }))
    await expect(canvas.getByRole('dialog')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()
  },
}

// Open → close via close button
export const CloseWithButton: Story = {
  args: { defaultOpen: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Open Modal' }))

    const dialog = canvas.getByRole('dialog')
    await expect(dialog).toBeVisible()

    await userEvent.click(within(dialog).getByRole('button', { name: 'close modal' }))
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()
  },
}

// Tab cycles through focusable elements inside modal
export const FocusTrap: Story = {
  args: { defaultOpen: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dialog = canvas.getByRole('dialog')

    // close button auto-focused on open
    await expect(within(dialog).getByRole('button', { name: 'close modal' })).toHaveFocus()

    // Tab through: close → Cancel → Confirm → wraps to close
    await userEvent.tab()
    await expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus()

    await userEvent.tab()
    await expect(within(dialog).getByRole('button', { name: 'Confirm' })).toHaveFocus()

    await userEvent.tab() // wraps back to first
    await expect(within(dialog).getByRole('button', { name: 'close modal' })).toHaveFocus()
  },
}
