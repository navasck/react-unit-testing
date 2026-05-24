import { render, screen } from '@testing-library/react'
import UserList from '../../components/UserList'

const mockUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '123-456-7890' },
  { id: 2, name: 'Bob Smith',    email: 'bob@example.com',   phone: '987-654-3210' },
]

// Helper — returns a successful fetch response
function mockFetchSuccess(data: unknown) {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  } as Response)
}

// Helper — simulates a non-2xx HTTP response
function mockFetchHttpError() {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
    ok: false,
    json: async () => ({}),
  } as Response)
}

// Helper — simulates a network-level failure (no connection)
function mockFetchNetworkError(message = 'Network error') {
  vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error(message))
}

beforeEach(() => vi.restoreAllMocks())
afterEach(() => vi.restoreAllMocks())

// ─── Unit Tests ────────────────────────────────────────────────────────────────

describe('UserList — loading state', () => {
  it('shows loading indicator on initial render', () => {
    // fetch never resolves during this test — loading stays visible
    vi.spyOn(globalThis, 'fetch').mockReturnValueOnce(new Promise(() => {}))
    render(<UserList />)
    expect(screen.getByLabelText('loading')).toBeInTheDocument()
    expect(screen.getByText(/loading users/i)).toBeInTheDocument()
  })
})

describe('UserList — success state', () => {
  it('renders the list of users after fetch resolves', async () => {
    mockFetchSuccess(mockUsers)
    render(<UserList />)

    // findBy* waits for the DOM to update after the async fetch
    expect(await screen.findByLabelText('user list')).toBeInTheDocument()
  })

  it('displays each user name', async () => {
    mockFetchSuccess(mockUsers)
    render(<UserList />)

    expect(await screen.findByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
  })

  it('displays each user email and phone', async () => {
    mockFetchSuccess(mockUsers)
    render(<UserList />)

    await screen.findByText('Alice Johnson')

    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('123-456-7890')).toBeInTheDocument()
  })

  it('renders the correct number of users', async () => {
    mockFetchSuccess(mockUsers)
    render(<UserList />)

    await screen.findByText('Alice Johnson')

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(mockUsers.length)
  })

  it('hides the loading indicator once data loads', async () => {
    mockFetchSuccess(mockUsers)
    render(<UserList />)

    await screen.findByText('Alice Johnson')

    expect(screen.queryByLabelText('loading')).not.toBeInTheDocument()
  })
})

describe('UserList — error state', () => {
  it('shows error UI when the network request fails', async () => {
    mockFetchNetworkError('Network error')
    render(<UserList />)

    expect(await screen.findByLabelText('error')).toBeInTheDocument()
    expect(screen.getByText(/network error/i)).toBeInTheDocument()
  })

  it('shows error UI when the server returns a non-ok status', async () => {
    mockFetchHttpError()
    render(<UserList />)

    expect(await screen.findByLabelText('error')).toBeInTheDocument()
    expect(screen.getByText(/failed to fetch users/i)).toBeInTheDocument()
  })

  it('hides loading and user list when an error occurs', async () => {
    mockFetchNetworkError()
    render(<UserList />)

    await screen.findByLabelText('error')

    expect(screen.queryByLabelText('loading')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('user list')).not.toBeInTheDocument()
  })
})

// ─── Integration Tests ─────────────────────────────────────────────────────────

describe('UserList — integration', () => {
  it('calls fetch with the correct URL', async () => {
    mockFetchSuccess(mockUsers)
    render(<UserList />)

    await screen.findByText('Alice Johnson')

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    expect(globalThis.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users')
  })

  it('transitions from loading → success', async () => {
    mockFetchSuccess(mockUsers)
    render(<UserList />)

    // loading first
    expect(screen.getByLabelText('loading')).toBeInTheDocument()

    // then success
    expect(await screen.findByLabelText('user list')).toBeInTheDocument()
    expect(screen.queryByLabelText('loading')).not.toBeInTheDocument()
  })

  it('transitions from loading → error', async () => {
    mockFetchNetworkError()
    render(<UserList />)

    // loading first
    expect(screen.getByLabelText('loading')).toBeInTheDocument()

    // then error
    expect(await screen.findByLabelText('error')).toBeInTheDocument()
    expect(screen.queryByLabelText('loading')).not.toBeInTheDocument()
  })
})
