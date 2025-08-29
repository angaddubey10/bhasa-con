import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../common/Header'

const Layout: React.FC = () => {
  const location = useLocation()
  
  // Routes where header should not appear
  const hideHeaderRoutes = ['/login', '/register']
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname)

  return (
    <div className="min-h-screen bg-gray-100">
      {shouldShowHeader && <Header />}
      <main className={shouldShowHeader ? 'pt-16' : ''}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
