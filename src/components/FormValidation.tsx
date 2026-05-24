import { useState } from 'react'

type Fields = {
  name: string
  email: string
  password: string
}

type Errors = Partial<Fields>
type Touched = Partial<Record<keyof Fields, boolean>>

function validate(fields: Fields): Errors {
  const errors: Errors = {}

  if (!fields.name.trim())
    errors.name = 'Name is required'
  else if (fields.name.trim().length < 2)
    errors.name = 'Name must be at least 2 characters'

  if (!fields.email.trim())
    errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errors.email = 'Enter a valid email address'

  if (!fields.password)
    errors.password = 'Password is required'
  else if (fields.password.length < 8)
    errors.password = 'Password must be at least 8 characters'

  return errors
}

function FormValidation() {
  const [fields, setFields] = useState<Fields>({ name: '', email: '', password: '' })
  const [touched, setTouched] = useState<Touched>({})
  const [submitted, setSubmitted] = useState(false)

  const errors = validate(fields)
  const isValid = Object.keys(errors).length === 0

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({ name: true, email: true, password: true })
    if (!isValid) return
    setSubmitted(true)
  }

  function showError(field: keyof Fields) {
    return (touched[field] || false) && errors[field]
  }

  if (submitted) {
    return (
      <div aria-label="success message" className="text-center py-8">
        <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
          Form submitted successfully!
        </p>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Welcome, {fields.name}.</p>
        <button
          onClick={() => { setFields({ name: '', email: '', password: '' }); setTouched({}); setSubmitted(false) }}
          className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm transition"
        >
          Reset
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="registration form" className="space-y-5">

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={fields.name}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!showError('name')}
          aria-describedby={showError('name') ? 'name-error' : undefined}
          placeholder="John Doe"
          className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition
            ${showError('name')
              ? 'border-red-400 focus:ring-red-300'
              : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-400'}`}
        />
        {showError('name') && (
          <p id="name-error" role="alert" className="mt-1 text-sm text-red-500">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={fields.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!showError('email')}
          aria-describedby={showError('email') ? 'email-error' : undefined}
          placeholder="john@example.com"
          className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition
            ${showError('email')
              ? 'border-red-400 focus:ring-red-300'
              : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-400'}`}
        />
        {showError('email') && (
          <p id="email-error" role="alert" className="mt-1 text-sm text-red-500">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={fields.password}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!showError('password')}
          aria-describedby={showError('password') ? 'password-error' : undefined}
          placeholder="Min. 8 characters"
          className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition
            ${showError('password')
              ? 'border-red-400 focus:ring-red-300'
              : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-400'}`}
        />
        {showError('password') && (
          <p id="password-error" role="alert" className="mt-1 text-sm text-red-500">
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={false}
        aria-disabled={!isValid}
        className={`w-full py-2 px-4 rounded-lg font-medium text-white transition
          ${isValid
            ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
            : 'bg-indigo-300 dark:bg-indigo-900 cursor-not-allowed'}`}
      >
        Submit
      </button>
    </form>
  )
}

export default FormValidation
