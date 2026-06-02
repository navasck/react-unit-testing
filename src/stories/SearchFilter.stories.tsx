import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'
import SearchFilter from '../components/SearchFilter'

const meta: Meta<typeof SearchFilter> = {
  title: 'Components/SearchFilter',
  component: SearchFilter,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof SearchFilter>

// Initial empty state — all 15 items visible
export const Default: Story = {}

// User has typed a query — filtered results shown
export const WithQuery: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole('textbox', { name: 'search input' }), 'mango')
    await expect(canvas.getByText('Mango')).toBeInTheDocument()
  },
}

// Multiple matches
export const MultipleMatches: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole('textbox', { name: 'search input' }), 'an')
    // Banana, Mango, Orange all contain 'an'
    await expect(canvas.getAllByRole('listitem').length).toBeGreaterThan(1)
  },
}

// No results state
export const NoResults: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole('textbox', { name: 'search input' }), 'zzz')
    await expect(canvas.getByTestId('no-results')).toBeInTheDocument()
  },
}

// Type → see results → clear → all items restored
export const ClearInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'search input' })

    await userEvent.type(input, 'kiwi')
    await expect(canvas.getByText('Kiwi')).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'clear search' }))
    await expect(canvas.getAllByRole('listitem')).toHaveLength(15)
  },
}
