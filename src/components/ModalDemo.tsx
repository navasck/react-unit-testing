import { useState } from 'react'
import Modal from './Modal'

function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section aria-label="modal demo" className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Modal</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Accessible portal dialog with focus trap, Escape key, and backdrop click.
      </p>

      <button
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
      >
        Open Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
      >
        <p className="mb-5">Are you sure you want to proceed? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </section>
  )
}

export default ModalDemo
