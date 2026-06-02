import { render, screen, waitFor, act } from '@testing-library/react'
import PostList, { type Post } from '../../components/PostList'

// ─── Why no data-testid="post-N" assertions ────────────────────────────────────
// @tanstack/react-virtual only renders items visible inside the scroll container.
// jsdom has no layout engine — container height is 0 — so the virtualizer renders
// nothing. Posts ARE fetched and stored in state (the count badge proves this),
// but the virtual DOM items never appear.
// We test data-layer behaviour (fetch calls, state signals) rather than virtual
// DOM presence. Virtualized rendering is verified in Storybook / browser tests.

// ─── IntersectionObserver mock ─────────────────────────────────────────────────

type IOCallback = IntersectionObserverCallback

let ioCallback: IOCallback
const mockObserve    = vi.fn()
const mockDisconnect = vi.fn()

beforeEach(() => {
  mockObserve.mockClear()
  mockDisconnect.mockClear()

  vi.stubGlobal('IntersectionObserver', vi.fn(class {
    observe    = mockObserve
    disconnect = mockDisconnect
    constructor(cb: IOCallback) { ioCallback = cb }
  }))
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function triggerIntersect(isIntersecting = true) {
  act(() => {
    ioCallback(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver
    )
  })
}

// ─── Fetch helpers ─────────────────────────────────────────────────────────────

function makePosts(count: number, startId = 1): Post[] {
  return Array.from({ length: count }, (_, i) => ({
    id:     startId + i,
    userId: 1,
    title:  `Post ${startId + i}`,
    body:   `Body of post ${startId + i}`,
  }))
}

function mockFetchPages(pages: Post[][]) {
  let call = 0
  return vi.spyOn(globalThis, 'fetch').mockImplementation(() => {
    const data = pages[call++] ?? []
    return Promise.resolve({ ok: true, json: async () => data } as Response)
  })
}

// ─── Loading state ─────────────────────────────────────────────────────────────

describe('PostList — loading', () => {
  it('shows loading indicator while fetching', async () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))
    render(<PostList />)
    triggerIntersect()
    expect(await screen.findByLabelText('loading posts')).toBeInTheDocument()
  })

  it('hides loading indicator after data arrives', async () => {
    mockFetchPages([makePosts(20)])
    render(<PostList />)
    triggerIntersect()
    await waitFor(() =>
      expect(screen.queryByLabelText('loading posts')).not.toBeInTheDocument()
    )
  })
})

// ─── Success state ─────────────────────────────────────────────────────────────
// Count badge "X / 100" proves data was fetched and stored in state,
// even though the virtualizer doesn't render items in jsdom.

describe('PostList — success', () => {
  it('updates count badge after first page loads', async () => {
    mockFetchPages([makePosts(20)])
    render(<PostList />)
    triggerIntersect()
    expect(await screen.findByText('20 / 100')).toBeInTheDocument()
  })

  it('shows all-loaded message when fewer than PAGE_SIZE items arrive', async () => {
    mockFetchPages([makePosts(5)])
    render(<PostList />)
    triggerIntersect()
    expect(await screen.findByLabelText('all posts loaded')).toBeInTheDocument()
  })

  it('updates count badge after second page appends', async () => {
    mockFetchPages([makePosts(20), makePosts(20, 21)])
    render(<PostList />)

    triggerIntersect()
    await screen.findByText('20 / 100')

    triggerIntersect()
    await screen.findByText('40 / 100')
  })
})

// ─── Error state ───────────────────────────────────────────────────────────────

describe('PostList — error', () => {
  it('shows error when server returns non-ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false } as Response)
    render(<PostList />)
    triggerIntersect()
    expect(await screen.findByRole('alert')).toHaveTextContent('Failed to load posts')
  })

  it('shows error on network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))
    render(<PostList />)
    triggerIntersect()
    expect(await screen.findByRole('alert')).toHaveTextContent('Network error')
  })
})

// ─── IntersectionObserver integration ──────────────────────────────────────────

describe('PostList — IntersectionObserver', () => {
  it('creates an IntersectionObserver on mount', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))
    render(<PostList />)
    expect(IntersectionObserver).toHaveBeenCalled()
  })

  it('observes the sentinel element', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))
    render(<PostList />)
    expect(mockObserve).toHaveBeenCalledWith(screen.getByTestId('sentinel'))
  })

  it('does NOT fetch when intersection is false', () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))
    render(<PostList />)
    triggerIntersect(false)
    expect(spy).not.toHaveBeenCalled()
  })

  it('fetches page 1 with correct URL on first intersection', async () => {
    const spy = mockFetchPages([makePosts(20)])
    render(<PostList />)
    triggerIntersect()
    await screen.findByText('20 / 100')
    expect(spy).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/posts?_start=0&_limit=20'
    )
  })

  it('fetches page 2 with correct URL on second intersection', async () => {
    const spy = mockFetchPages([makePosts(20), makePosts(20, 21)])
    render(<PostList />)
    triggerIntersect()
    await screen.findByText('20 / 100')
    triggerIntersect()
    await screen.findByText('40 / 100')
    expect(spy).toHaveBeenNthCalledWith(
      2,
      'https://jsonplaceholder.typicode.com/posts?_start=20&_limit=20'
    )
  })

  it('calls fetch twice total for two intersections', async () => {
    const spy = mockFetchPages([makePosts(20), makePosts(20, 21)])
    render(<PostList />)
    triggerIntersect()
    await screen.findByText('20 / 100')
    triggerIntersect()
    await screen.findByText('40 / 100')
    expect(spy).toHaveBeenCalledTimes(2)
  })
})

// ─── Integration ───────────────────────────────────────────────────────────────

describe('PostList — integration', () => {
  it('full flow: two pages load and count increments each time', async () => {
    mockFetchPages([makePosts(20), makePosts(20, 21)])
    render(<PostList />)

    triggerIntersect()
    await screen.findByText('20 / 100')

    triggerIntersect()
    await screen.findByText('40 / 100')
  })

  it('stops fetching after receiving fewer than PAGE_SIZE items', async () => {
    const spy = mockFetchPages([makePosts(3)])
    render(<PostList />)
    triggerIntersect()
    await screen.findByLabelText('all posts loaded')

    // Extra intersection should NOT trigger another fetch
    triggerIntersect()
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
