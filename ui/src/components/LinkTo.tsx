import { Link } from 'react-router-dom'
import { knownPages } from '../helpers/navTo'

// Create a type that has all the types of props that NavLink props has
// except for the "to" prop but does have a toPage prop
type NavLinkToProps = Omit<React.ComponentProps<typeof Link>, 'to'> & {
  toPage: keyof typeof knownPages
  args?: string[]
}

export function LinkTo({ toPage, children, args, ...rest }: NavLinkToProps) {
  let path = ''
  const route = knownPages[toPage]
  if (typeof route === 'function') {
    path = route(...(args ?? []))
  } else if (typeof route === 'string') {
    path = route
  }

  return (
    <Link to={path} {...rest}>
      {children}
    </Link>
  )
}
