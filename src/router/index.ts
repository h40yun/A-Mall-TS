// ==================== ROUTER ====================

type RouteHandler = () => void

const routes: Map<string, RouteHandler> = new Map()
let currentRoute = ''

export function route(path: string, handler: RouteHandler): void {
  routes.set(path, handler)
}

export function navigate(path: string): void {
  window.history.pushState({}, '', path)
  handleRoute()
}

export function handleRoute(): void {
  const path = window.location.pathname
  const search = window.location.search

  // Try exact match first
  if (routes.has(path)) {
    currentRoute = path
    routes.get(path)!()
    return
  }

  // Try pattern matching (e.g., /product/:id)
  for (const [pattern, handler] of routes) {
    if (matchRoute(pattern, path)) {
      currentRoute = pattern
      handler()
      return
    }
  }

  // Default: 404
  if (routes.has('/404')) {
    currentRoute = '/404'
    routes.get('/404')!()
  } else if (routes.has('/')) {
    currentRoute = '/'
    routes.get('/')!()
  }
}

function matchRoute(pattern: string, path: string): boolean {
  const patternParts = pattern.split('/')
  const pathParts = path.split('/')
  if (patternParts.length !== pathParts.length) return false
  return patternParts.every((part, i) => part.startsWith(':') || part === pathParts[i])
}

export function getParam(name: string): string | null {
  const path = window.location.pathname
  const pattern = currentRoute
  const patternParts = pattern.split('/')
  const pathParts = path.split('/')
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':') && patternParts[i].slice(1) === name) {
      return pathParts[i]
    }
  }
  return new URLSearchParams(window.location.search).get(name)
}

export function initRouter(): void {
  // Handle SPA redirect from 404.html (GitHub Pages)
  const spaRedirect = sessionStorage.getItem('spa-redirect')
  if (spaRedirect) {
    sessionStorage.removeItem('spa-redirect')
    window.history.replaceState({}, '', spaRedirect)
  }

  window.addEventListener('popstate', handleRoute)
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('a')
    if (target && target.href.startsWith(window.location.origin) && !target.hasAttribute('data-external')) {
      e.preventDefault()
      navigate(target.href.replace(window.location.origin, ''))
    }
  })
}
