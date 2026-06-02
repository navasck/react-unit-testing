import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from 'storybook/test'
import Counter from '../components/Counter'

const meta: Meta<typeof Counter> = {
  title: 'Components/Counter',
  component: Counter,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Counter>

export const Default: Story = {}

export const AfterIncrement: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Increment' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Increment' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Increment' }))
  },
}

export const AfterDecrement: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Decrement' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Decrement' }))
  },
}

export const AfterReset: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Increment' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Increment' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }))
  },
}
