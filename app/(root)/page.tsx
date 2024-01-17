"use client"

import { usePathname } from "next/navigation"
import accessProvider from "./actions/accessProvider"
import  logo_gray  from '@/image/logo_gray.png'
import Image from 'next/image';


export default function Home() {
  const path = usePathname()
  accessProvider(path)
    return (
      <div>
          <div className="mx-auto w-1/3 mt-36">
            <Image className='mx-auto opacity-40' src={logo_gray} alt=''></Image>
          </div>
      </div>
    )
  }
  