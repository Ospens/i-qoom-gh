export const required = value => (value || typeof value === 'number' ? undefined : 'Required')

export const email = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined
)

export const minValue = min => value => (value && value < min ? `Must be at least ${min}` : undefined)

export const maxValue = max => value => (value && value > max ? `Must be less then ${max}` : undefined)
