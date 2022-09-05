export function mix(r,e,n){return Array(3).fill().map(((t,i)=>r[i]*n+(1-n)*e[i]))}export function generateGradient(r,e,n){return Array(n).fill().map(((t,i)=>mix(r,e,i/(n-1))))}
