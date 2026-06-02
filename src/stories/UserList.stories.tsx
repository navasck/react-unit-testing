import type { Meta, StoryObj } from '@storybook/react'
import UserList from '../components/UserList'

const meta: Meta<typeof UserList> = {
  title: 'Components/UserList',
  component: UserList,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof UserList>

const mockUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '555-0101' },
  { id: 2, name: 'Bob Smith',    email: 'bob@example.com',   phone: '555-0102' },
  { id: 3, name: 'Carol White',  email: 'carol@example.com', phone: '555-0103' },
]

// fetch never resolves — component stays in loading state
export const Loading: Story = {
  args: {
    fetchFn: () => new Promise(() => {}),
  },
}

// fetch resolves with mock data
export const Success: Story = {
  args: {
    fetchFn: () =>
      Promise.resolve({
        ok: true,
        json: async () => mockUsers,
      } as Response),
  },
}

// fetch rejects — network failure
export const NetworkError: Story = {
  args: {
    fetchFn: () => Promise.reject(new Error('Network error')),
  },
}

// fetch resolves but server returns non-ok status
export const ServerError: Story = {
  args: {
    fetchFn: () =>
      Promise.resolve({
        ok: false,
        json: async () => ({}),
      } as Response),
  },
}
