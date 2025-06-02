'use client'
import { SessionProvider } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Header from './Header';

export function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideOnRoutes = ['/login', '/register'];
  const shouldHideHeader = hideOnRoutes.includes(pathname);

  return (
    <>
      <SessionProvider>
        {!shouldHideHeader && <Header />}
        {children}
      </SessionProvider>
    </>
  )
}
