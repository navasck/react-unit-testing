import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from 'storybook/test'
import FormValidation from '../components/FormValidation'

const meta: Meta<typeof FormValidation> = {
  title: 'Components/FormValidation',
  component: FormValidation,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FormValidation>

export const Empty: Story = {}

export const WithErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // submit empty form to reveal all errors
    await userEvent.click(canvas.getByRole('button', { name: /submit/i }))
  },
}

export const PartiallyFilled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText(/full name/i), 'Alice')
    await userEvent.type(canvas.getByLabelText(/email address/i), 'not-valid')
    await userEvent.click(canvas.getByRole('button', { name: /submit/i }))
  },
}

export const FilledAndValid: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText(/full name/i), 'Alice Johnson')
    await userEvent.type(canvas.getByLabelText(/email address/i), 'alice@example.com')
    await userEvent.type(canvas.getByLabelText(/password/i), 'secret123')
  },
}

export const Submitted: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText(/full name/i), 'Alice Johnson')
    await userEvent.type(canvas.getByLabelText(/email address/i), 'alice@example.com')
    await userEvent.type(canvas.getByLabelText(/password/i), 'secret123')
    await userEvent.click(canvas.getByRole('button', { name: /submit/i }))
  },
}
