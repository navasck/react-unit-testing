import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from 'storybook/test'
import TodoList from '../components/TodoList'

const meta: Meta<typeof TodoList> = {
  title: 'Components/TodoList',
  component: TodoList,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TodoList>

export const Empty: Story = {}

export const WithTasks: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const task of ['Buy groceries', 'Walk the dog', 'Read a book']) {
      await userEvent.type(canvas.getByRole('textbox', { name: 'task input' }), task)
      await userEvent.click(canvas.getByRole('button', { name: 'Add' }))
    }
  },
}

export const WithCompletedTasks: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const task of ['Task A', 'Task B', 'Task C']) {
      await userEvent.type(canvas.getByRole('textbox', { name: 'task input' }), task)
      await userEvent.click(canvas.getByRole('button', { name: 'Add' }))
    }
    // mark Task A and Task C as done
    await userEvent.click(canvas.getByText('Task A'))
    await userEvent.click(canvas.getByText('Task C'))
  },
}
