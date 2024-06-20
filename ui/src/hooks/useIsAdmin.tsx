import Session from 'supertokens-web-js/recipe/session'
import { UserRoleClaim } from 'supertokens-web-js/recipe/userroles'
import { useLocalCache } from './useLocalCache'

// export function useIsAdmin() {
//   const [isAdmin, setIsAdmin] = useState(false)

//   useEffect(() => {
//     const testIsAdmin = async () => {
//       if (await Session.doesSessionExist()) {
//         const roles = await Session.getClaimValue({ claim: UserRoleClaim })
//         if (roles !== undefined && roles.includes('admin')) {
//           // User is an admin
//           setIsAdmin(true)
//         }
//       }
//       // either a session does not exist, or the user is not an admin
//     }
//     testIsAdmin()
//   })

//   return isAdmin
// }

const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean'

export function useIsAdmin() {
  const { value: isAdmin } = useLocalCache(
    isBoolean,
    'isAdmin',
    false,
    async () => {
      if (await Session.doesSessionExist()) {
        const roles = await Session.getClaimValue({ claim: UserRoleClaim })
        return roles !== undefined && roles.includes('admin')
      }
      return false
    },
  )

  return isAdmin
}
