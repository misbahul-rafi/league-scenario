'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import slugify from '../utils/slugify'
import { IoMdArrowDropdown } from "react-icons/io"

export default function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const esports = ['Mobile Legends', 'Valorant', 'Dota 2']
  const [isDropdownVisible, setDropdownVisible] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold tracking-wide hover:text-blue-400 transition">
            🏆 Leaderboard
          </span>
        </Link>

        <nav className="relative flex items-center space-x-6">
          <Link href="/" className={`hover:text-blue-400 transition ${pathname === '/' ? 'text-[#8B5DFF] font-semibold' : ''}`}>Home</Link>

          <div className="flex items-center cursor-pointer hover:text-blue-400 transition relative"
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}>
            Esports <IoMdArrowDropdown className="ml-1" />
            {isDropdownVisible && (
              <div className="absolute top-full rounded shadow-lg z-10 w-44">
                <span className="p-1"></span>
                <div className="bg-gray-800">
                  {esports.map((esport) => (
                    <Link key={esport} href={`/games/${slugify(esport)}`} className="block px-4 py-2 hover:bg-gray-700">{esport}</Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {session ? (
            <div ref={userMenuRef} className="relative">
              <button onClick={() => setUserMenuOpen(prev => !prev)} className="text-sm hover:text-blue-400 transition">
                <strong className='text-base'>{session.user.username}</strong>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded shadow-lg z-50">
                  <Link
                    href={'/profile'}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  {session.user.role === "admin" && (
                    <Link
                      href={'/admin'}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                    >
                      Administrator
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut()
                      setUserMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={`hover:text-blue-400 transition ${pathname === '/login' ? 'text-blue-400 font-semibold' : ''}`}>
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
