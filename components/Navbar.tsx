"use client"
import { useUserAuth } from "@/app/(root)/context/AuthContext";
import Link from "next/link";

 

export default function Navbar() {
  const {user} = useUserAuth()
  return (
        <ul className="flex gap-3 justify-center">
            {
              user && 
              <>
                <li><Link prefetch href='/addsell'>Add Sell</Link></li> 
                <li><Link prefetch href='/addproduct'>Add Product</Link></li>
                <li><Link prefetch href='/products'>Products</Link></li>
                <li><Link prefetch href='/sellrecords'>Sell Records</Link></li>
                <li><Link prefetch href='/addmonthly'>Add Monthly Records</Link></li>
                <li><Link prefetch href='/monthly'>Monthly Revenue</Link></li>
              </>
            }
        </ul>
  )
}
