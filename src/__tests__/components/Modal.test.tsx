import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../../components/Modal'

// Helper — renders Modal with sensible defaults
function renderModal(props: Partial<React.ComponentProps<typeof Modal>> = {}) {
  const onClose = vi.fn()
  render(
    <Modal isOpen={true} onClose={onClose} title="Test Modal" {...props}>
      <p>Modal body content</p>
      <button>Action One</button>
      <button>Action Two</button>
    </Modal>
  )
  return { onClose }
}

// ─── Rendering ─────────────────────────────────────────────────────────────────

describe('Modal — rendering', () => {
  it('renders nothing when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Hidden">
        <p>content</p>
      </Modal>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the dialog when isOpen is true', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders into document.body via portal (outside RTL container)', () => {
    renderModal()
    // portal appends directly to body — the dialog's parent chain reaches body
    expect(document.body).toContainElement(screen.getByRole('dialog'))
  })

  it('renders the title', () => {
    renderModal()
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
  })

  it('renders children content', () => {
    renderModal()
    expect(screen.getByText('Modal body content')).toBeInTheDocument()
  })

  it('renders the backdrop', () => {
    renderModal()
    expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument()
  })

  it('renders the close button', () => {
    renderModal()
    expect(screen.getByRole('button', { name: 'close modal' })).toBeInTheDocument()
  })
})

// ─── Visibility ────────────────────────────────────────────────────────────────

describe('Modal — visibility', () => {
  it('dialog is visible when open', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toBeVisible()
  })

  it('title text is visible', () => {
    renderModal()
    expect(screen.getByText('Test Modal')).toBeVisible()
  })

  it('children content is visible', () => {
    renderModal()
    expect(screen.getByText('Modal body content')).toBeVisible()
  })

  it('close button is visible', () => {
    renderModal()
    expect(screen.getByRole('button', { name: 'close modal' })).toBeVisible()
  })
})

// ─── Accessibility ─────────────────────────────────────────────────────────────

describe('Modal — accessibility', () => {
  it('has role="dialog"', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('has aria-modal="true"', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('has aria-labelledby pointing to the title element', () => {
    renderModal()
    const dialog = screen.getByRole('dialog')
    const labelId = dialog.getAttribute('aria-labelledby')
    expect(labelId).toBeTruthy()
    const titleEl = document.getElementById(labelId!)
    expect(titleEl).toHaveTextContent('Test Modal')
  })

  it('has aria-describedby pointing to the body element', () => {
    renderModal()
    const dialog = screen.getByRole('dialog')
    const descId = dialog.getAttribute('aria-describedby')
    expect(descId).toBeTruthy()
    const descEl = document.getElementById(descId!)
    expect(descEl).toContainElement(screen.getByText('Modal body content'))
  })

  it('backdrop has aria-hidden="true"', () => {
    renderModal()
    expect(screen.getByTestId('modal-backdrop')).toHaveAttribute('aria-hidden', 'true')
  })

  it('locks body scroll when open', () => {
    renderModal()
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body scroll when closed', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="T"><p>c</p></Modal>
    )
    expect(document.body.style.overflow).toBe('hidden')
    rerender(<Modal isOpen={false} onClose={vi.fn()} title="T"><p>c</p></Modal>)
    expect(document.body.style.overflow).toBe('')
  })
})

// ─── Close interactions ────────────────────────────────────────────────────────

describe('Modal — close interactions', () => {
  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const { onClose } = renderModal()
    await user.click(screen.getByRole('button', { name: 'close modal' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup()
    const { onClose } = renderModal()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const { onClose } = renderModal()
    await user.click(screen.getByTestId('modal-backdrop'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does NOT call onClose when clicking inside the dialog', async () => {
    const user = userEvent.setup()
    const { onClose } = renderModal()
    await user.click(screen.getByText('Modal body content'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('does NOT call onClose on arbitrary key presses', async () => {
    const user = userEvent.setup()
    const { onClose } = renderModal()
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowUp}')
    expect(onClose).not.toHaveBeenCalled()
  })
})

// ─── Focus management ──────────────────────────────────────────────────────────

describe('Modal — focus management', () => {
  it('moves focus to the first focusable element (close button) on open', () => {
    renderModal()
    expect(screen.getByRole('button', { name: 'close modal' })).toHaveFocus()
  })

  it('traps focus: Tab from last element wraps to first', async () => {
    const user = userEvent.setup()
    renderModal()

    // Focus order: close → Action One → Action Two → (wraps to close)
    await user.tab()  // close → Action One
    await user.tab()  // Action One → Action Two
    await user.tab()  // Action Two → wraps to close button

    expect(screen.getByRole('button', { name: 'close modal' })).toHaveFocus()
  })

  it('traps focus: Shift+Tab from first element wraps to last', async () => {
    const user = userEvent.setup()
    renderModal()

    // Focus is on close button (first) — Shift+Tab wraps to last
    await user.tab({ shift: true })

    expect(screen.getByRole('button', { name: 'Action Two' })).toHaveFocus()
  })

  it('focus cycles correctly through all focusable elements', async () => {
    const user = userEvent.setup()
    renderModal()

    // Verify full cycle: close → one → two → back to close
    expect(screen.getByRole('button', { name: 'close modal' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Action One' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Action Two' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'close modal' })).toHaveFocus()
  })

  it('returns focus to the trigger element when closed', async () => {
    const user = userEvent.setup()

    // Render a trigger button + controlled modal
    function TestApp() {
      const [open, setOpen] = React.useState(false)
      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          <Modal isOpen={open} onClose={() => setOpen(false)} title="T">
            <p>content</p>
          </Modal>
        </>
      )
    }

    const React = await import('react')
    render(<TestApp />)

    const trigger = screen.getByRole('button', { name: 'Open' })
    await user.click(trigger)                                    // opens modal
    await user.keyboard('{Escape}')                              // closes modal

    expect(trigger).toHaveFocus()                               // focus restored
  })
})

// ─── Integration: ModalDemo ────────────────────────────────────────────────────

describe('Modal — integration (ModalDemo)', () => {
  it('opens modal when trigger button is clicked', async () => {
    const user = userEvent.setup()
    const { default: ModalDemo } = await import('../../components/ModalDemo')
    render(<ModalDemo />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open Modal' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeVisible()
  })

  it('closes modal via Cancel button and restores focus to trigger', async () => {
    const user = userEvent.setup()
    const { default: ModalDemo } = await import('../../components/ModalDemo')
    render(<ModalDemo />)

    await user.click(screen.getByRole('button', { name: 'Open Modal' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open Modal' })).toHaveFocus()
  })

  it('within() scopes queries to the dialog only', async () => {
    const user = userEvent.setup()
    const { default: ModalDemo } = await import('../../components/ModalDemo')
    render(<ModalDemo />)

    await user.click(screen.getByRole('button', { name: 'Open Modal' }))

    const dialog = screen.getByRole('dialog')
    const dialogQueries = within(dialog)

    // within() ensures we only find buttons INSIDE the dialog
    expect(dialogQueries.getByRole('button', { name: 'close modal' })).toBeInTheDocument()
    expect(dialogQueries.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(dialogQueries.queryByRole('button', { name: 'Open Modal' })).not.toBeInTheDocument()
  })
})
