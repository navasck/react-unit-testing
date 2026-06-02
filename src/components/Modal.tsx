import { useEffect, useRef, useId } from 'react'
import { createPortal } from 'react-dom'


// Finds all keyboard-reachable elements inside the dialog for the trap
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

type Props = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

function Modal({ isOpen, onClose, title, children }: Props) {
  const titleId   = useId()
  const descId    = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  // Focus Restoration
  // WCAG compliant modal dialogs should return focus to the element that triggered them when they close. This is important for keyboard and screen reader users to maintain context. We save the currently focused element when the modal opens, and restore focus to it when the modal closes.
  // Save the element that triggered the modal so focus returns to it on close
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement
    } else {
      triggerRef.current?.focus()
    }
  }, [isOpen])

  // Auto-focus first focusable element inside dialog on open
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return
    const first = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)[0]
    first?.focus()
  }, [isOpen])

  // Focus trap + Escape key — both on same document keydown listener
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return
    const dialog = dialogRef.current


// This function is implementing two accessibility features:

// Close modal on Escape
// Trap keyboard focus inside the modal
//This code implements a focus trap. When the user presses Tab on the last focusable element, focus is moved back to the first element. When the user presses Shift+Tab on the first focusable element, focus is moved to the last element. This creates a circular focus loop, ensuring keyboard users cannot tab outside the modal while it is open. The same handler also closes the modal when the Escape key is pressed.
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key !== 'Tab') return

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
      )
      if (!focusable.length) { e.preventDefault(); return }

      const first = focusable[0]
      const last  = focusable[focusable.length - 1]

      //Infinite loop inside modal. If Tab is pressed on the last focusable element, move focus to the first. If Shift+Tab is pressed on the first focusable element, move focus to the last. This ensures that keyboard users can only navigate within the modal while it is open.
      if (e.shiftKey) {
        // Shift+Tab on first element → jump to last
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        // Tab on last element → jump to first
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Scroll Lock
  // Prevents background scrolling. This is important because if the background content scrolls while a modal is open, it can lead to a confusing user experience, especially for keyboard and screen reader users. By locking the scroll, we ensure that the user's focus remains on the modal content and that the background does not shift unexpectedly.
  // Prevent body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        data-testid="modal-backdrop"
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <h2
              id={titleId}
              className="text-xl font-semibold text-gray-800 dark:text-white"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="close modal"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none transition"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div
            id={descId}
            className="px-6 py-5 text-gray-600 dark:text-gray-300"
          >
            {children}
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}

export default Modal



// This modal uses React Portal to avoid stacking-context issues, implements proper accessibility with role="dialog" and ARIA attributes, restores focus to the triggering element, traps keyboard focus within the dialog, supports Escape key closing, and locks body scrolling. For large-scale applications, I would further extract focus management, keyboard handling, and scroll locking into reusable hooks to improve maintainability and testability.



// When implementing a modal, these are the key accessibility requirements we should follow:

// 1. Use Proper Dialog Semantics
// 2. Provide an Accessible Name   -  aria-labelledby
// 3. Provide a Description (Optional but Recommended)  -  aria-describedby
// 4. Move Focus Into the Modal on Open, Keyboard users should immediately be inside the modal.
// 5. Trap Focus Inside the Modal
// 6. Restore Focus on Close
// 7. Support Escape Key
// 8. Provide a Visible Close Button  
// 9. Prevent Background Scrolling, Prevent Background Interaction
// 10. Ensure Sufficient Color Contrast
// 11. Test with Screen Readers and Keyboard Only
// 12. Maintain Correct Heading Structure
// 13. Ensure Keyboard Accessibility (Tab, Shift + Tab, Enter, Space, Escape)
// 14. Use Semantic Buttons
// 15. Backdrop Should Not Be Focusable
// 16. Test with Accessibility Tools (WAVE Web Accessibility Evaluation Tool, Keyboard-only testing, Lighthouse, Screen reader testing (e.g. NVDA))

// ─── Rendering ────────────────────────────────────────────────────────────────


// Tech Lead Checklist

// Before shipping a modal, verify:

// ✅ role="dialog"
// ✅ aria-modal="true"
// ✅ aria-labelledby
// ✅ aria-describedby (if needed)
// ✅ Focus moves into modal on open
// ✅ Focus trap implemented
// ✅ Focus restored on close
// ✅ Escape closes modal
// ✅ Close button exists
// ✅ Background interaction blocked
// ✅ Body scroll locked
// ✅ Keyboard navigation works
// ✅ Proper heading structure


