"use client"
import { useUserAuth } from "@/app/(root)/context/AuthContext";
import Link from "next/link";
import { ModeToggle } from '@/components/Toogle-theme'
import './module.navbar.css'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react";

 

export default function Navbar() {
  const {user,logout,active} = useUserAuth()
  const noShow = active.includes('/sellrecords/')
  const [rotate,setRotate] = useState(false)
  const activeClass = 'text-zinc-800 dark:text-zinc-300 transition-all font-bold'
  const inactiveClass = 'text-zinc-500 dark:hover:text-zinc-300 hover:text-zinc-800 transition-all'
  return (
        <div className={noShow ? 'hidden' : ""}>
          <div className="lg-navbar">
              <ul className="flex px-10 justify-between border-b dark:border-zinc-700 border-zinc-200">
                {
                  user && 
                  <>
                    <div className="flex items-center gap-4">
                      <li className={active === '/' ? activeClass : inactiveClass}><Link prefetch href='/'>Home</Link></li> 
                      <li className={active === '/addsell' ? activeClass : inactiveClass}><Link prefetch href='/addsell'>Add Sell</Link></li> 
                      <li className={active === '/addproduct' ? activeClass : inactiveClass}><Link prefetch href='/addproduct'>Add Product</Link></li>
                      <li className={active === '/products' ? activeClass : inactiveClass}><Link prefetch href='/products'>Inventory</Link></li>
                      <li className={active === '/sellrecords' ? activeClass : inactiveClass}><Link prefetch href='/sellrecords'>Sell Records</Link></li>
                      <li className={active === '/addmonthly' ? activeClass : inactiveClass}><Link prefetch href='/addmonthly'>Add Monthly Records</Link></li>
                      <li className={active === '/monthly' ? activeClass : inactiveClass}><Link prefetch href='/monthly'>Monthly Revenue</Link></li>
                    </div>
                    <div className="flex gap-4 items-center">
                      <li className="hover:text-red-500 transition-all"><button onClick={()=>logout()}>Log Out</button></li>
                      <li ><ModeToggle /></li>
                    </div>
                  </>
                }
            </ul>
          </div>
          <div className="sm-navbar ">
          { user &&
            <DropdownMenu>
            <DropdownMenuTrigger className="fixed left-2 top-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
            onClick={()=>setRotate(!rotate)}
            className='w-6 h-6'>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>

            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className={active === '/' ? activeClass : inactiveClass}>
                <Link prefetch href='/'>Home</Link>
              </DropdownMenuLabel>
              <DropdownMenuLabel className={active === '/addsell' ? activeClass : inactiveClass}>
              <Link prefetch href='/addsell'>Add Sell</Link>
              </DropdownMenuLabel>
              <DropdownMenuLabel className={active === '/addproduct' ? activeClass : inactiveClass}>
              <Link prefetch href='/addproduct'>Add Product</Link>
              </DropdownMenuLabel>
              <DropdownMenuLabel className={active === '/products' ? activeClass : inactiveClass}>
              <Link prefetch href='/products'>Inventory</Link>
              </DropdownMenuLabel>
              <DropdownMenuLabel className={active === '/sellrecords' ? activeClass : inactiveClass}>
              <Link prefetch href='/sellrecords'>Sell Records</Link>
              </DropdownMenuLabel>
              <DropdownMenuLabel className={active === '/addmonthly' ? activeClass : inactiveClass}>
              <Link prefetch href='/addmonthly'>Add Monthly Records</Link>
              </DropdownMenuLabel>
              <DropdownMenuLabel className={active === '/monthly' ? activeClass : inactiveClass}>
              <Link prefetch href='/monthly'>Monthly Revenue</Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:text-red-600 text-red-500 transition-all">
              <button onClick={()=>logout()}>Log Out</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          }
          <ModeToggle />
          </div>
        </div>
  )
}
