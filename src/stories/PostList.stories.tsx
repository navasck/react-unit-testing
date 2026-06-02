import type { Meta, StoryObj } from '@storybook/react'
import PostList, { type Post } from '../components/PostList'

const meta: Meta<typeof PostList> = {
  title: 'Components/PostList',
  component: PostList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof PostList>

function makePosts(count: number, startId = 1): Post[] {
  return Array.from({ length: count }, (_, i) => ({
    id:     startId + i,
    userId: Math.ceil((startId + i) / 10),
    title:  `Post title number ${startId + i} — a compelling headline`,
    body:   `This is the body of post ${startId + i}. It contains some interesting content that spans multiple lines in the card.`,
  }))
}

// Loading — fetch never resolves
export const Loading: Story = {
  args: {
    fetchFn: () => new Promise(() => {}),
  },
}

// First page loaded (20 posts)
export const FirstPage: Story = {
  args: {
    fetchFn: () =>
      Promise.resolve({
        ok:   true,
        json: async () => makePosts(20),
      } as Response),
  },
}

// All 100 posts loaded (5 pages — simulated by returning full set at once)
export const AllLoaded: Story = {
  args: {
    fetchFn: (() => {
      let call = 0
      const pages = [
        makePosts(20,  1),
        makePosts(20, 21),
        makePosts(20, 41),
        makePosts(20, 61),
        makePosts(20, 81),
      ]
      return () =>
        Promise.resolve({
          ok:   true,
          json: async () => pages[call++] ?? [],
        } as Response)
    })(),
  },
}

// Network error
export const NetworkError: Story = {
  args: {
    fetchFn: () => Promise.reject(new Error('Network error')),
  },
}

// Server error (non-ok response)
export const ServerError: Story = {
  args: {
    fetchFn: () => Promise.resolve({ ok: false } as Response),
  },
}
