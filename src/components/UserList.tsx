import { useEffect, useState } from 'react'

type User = {
  id: number
  name: string
  email: string
  phone: string
}

type Status = 'loading' | 'success' | 'error'

type Props = {
  fetchFn?: typeof fetch
}

function UserList({ fetchFn = fetch }: Props) {
  const [users, setUsers] = useState<User[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFn('https://jsonplaceholder.typicode.com/users')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch users')
        return res.json()
      })
      .then((data: User[]) => {
        setUsers(data)
        setStatus('success')
      })
      .catch((err: Error) => {
        setError(err.message)
        setStatus('error')
      })
  }, [fetchFn])

  if (status === 'loading') {
    return (
      <div aria-label="loading" className="text-center py-8 text-gray-400 dark:text-gray-500">
        <p className="text-lg animate-pulse">Loading users...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div aria-label="error" className="text-center py-6 text-red-500 dark:text-red-400">
        <p className="font-medium">Something went wrong</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    )
  }

  return (
    <ul aria-label="user list" className="divide-y divide-gray-100 dark:divide-gray-700">
      {users.map((user) => (
        <li key={user.id} className="flex flex-col py-3 px-1">
          <span className="font-medium text-gray-800 dark:text-white">{user.name}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
          <span className="text-sm text-gray-400 dark:text-gray-500">{user.phone}</span>
        </li>
      ))}
    </ul>
  )
}

export default UserList
