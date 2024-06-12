const min = 33554432 // 32^5
const max = 1073741823 // 32^6 - 1
const range = max - min // 32^6 - 32^5 - 1

export function makeId() {
  const now = Math.floor((Date.now() - 0) / 1000)
  return `${toBase32(now)}-${toBase32(min + Math.floor(Math.random() * range))}`
}

const letterMap =
  '0:a,1:b,2:c,3:d,4:e,5:f,6:g,7:h,8:i,9:j,a:k,b:l,c:m,d:n,e:o,f:p,g:q,h:r,i:s,j:t,k:u,l:v,m:w,n:x,o:y,p:z,q:2,r:3,s:4,t:5,u:6,v:7'

const dictionary = Object.fromEntries(
  letterMap.split(',').map((s) => s.split(':'))
)

function toBase32(num: number) {
  const res = num
    .toString(32)
    .split('')
    .map((c) => dictionary[c])
    .join('')
  return res
}

// const reverse = Object.fromEntries(
//   Object.entries(dictionary).map(([k, v]) => [v, k])
// )

// function fromBase32(str) {
//   const base32 = str
//     .split('')
//     .map((c) => reverse[c])
//     .join('')

//   return parseInt(base32, 32)
// }
