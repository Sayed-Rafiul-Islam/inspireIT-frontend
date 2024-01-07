"use client"
import { useUserAuth } from "@/app/(root)/context/AuthContext";
import Link from "next/link";
import { ModeToggle } from '@/components/Toogle-theme'

 

export default function Navbar() {
  const {user,logout,active} = useUserAuth()
  const activeClass = 'text-zinc-800 dark:text-zinc-300 transition-all font-bold'
  const inactiveClass = 'text-zinc-500 dark:hover:text-zinc-300 hover:text-zinc-800 transition-all'
  return (
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
  )
}
