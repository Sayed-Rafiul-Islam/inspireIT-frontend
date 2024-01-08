"use client"

import Link from "next/link";
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation";

import toast, { Toaster } from 'react-hot-toast';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import accessProvider from "../actions/accessProvider";

interface Product {
  id : number,
  product_name : string,
  configuration : string,
  source_name : string,
  unit_price : number,
  quantity : number
}


export default function Products() {
  const path = usePathname()
  accessProvider(path)
  const [products, setProducts] = useState([])
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [update, setUpdate] = useState(false);
  const pages = Array.from(Array(pageCount).keys())

  //  page count
  useEffect(()=>{
    const getPageCount = async () => {
        const res = await fetch(`http://localhost:5000/inventoryPageCount`,{cache : "no-store"})
        const pageCount = await res.json()
        setPageCount(Math.ceil(pageCount))
    }
    getPageCount()
  },[update])

    // Products
  useEffect(()=> { 
    const getProducts = async () => {
      const res = await fetch(`http://localhost:5000/inventory?page=${page}`,{cache : "no-store"})
      const data = await res.json()
      setProducts(data)        
     }
    getProducts();
  },[page,update])


  const handleDelete = async (id : number) => {
    const res = await fetch(`http://localhost:5000/inventory?id=${id}`, {
      method : "DELETE"
    })
    const status = res.status
    if (status === 200) {
        toast.success(`Row removed permenantly !`)
        setUpdate(!update)
    }
}



  return (
    <div className="pb-20 lg:mt-0 mt-20">
        <h1 className="text-center text-5xl font-bold my-6">Inventory</h1>
        <div className="lg:w-11/12 flex mx-auto lg:overflow-auto overflow-x-scroll">
          {
            products.length === 0 ?
            <h1 className="text-red-500 text-3xl mx-auto">No Products Found</h1>
            :
            <table className="w-full border-collapse">
                <thead>
                <tr>
                  <th className="py-2">Serial No</th>
                  <th className="py-2">Product Name</th>
                  <th className="py-2">Configuration</th>
                  <th className="py-2">Source</th>
                  <th className="py-2">Unit Price</th>
                  <th className="py-2">Quantity</th>
                </tr>
                </thead>

                <tbody className="text-center">
                {
                  products.map(({id,product_name,configuration,source_name,unit_price,quantity} : Product,index) => {
                    if (product_name) {
                      return (
                        <tr className={index%2 === 1 ? 'bg-slate-200 dark:bg-zinc-900' : ''} key={index}>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700" >{page*10 + index+1}</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700 hover:text-green-600" >
                              <Link href={quantity < 1 ? `` :`/products/${id}`}>{product_name}</Link>
                            </td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700" >{configuration}</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700" >{source_name}</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700" >{unit_price} BDT</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700" >{quantity < 1 ? <span className="text-red-600 font-bold">Sold Out</span> : quantity}</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">
                            <AlertDialog>
                              <AlertDialogTrigger 
                              className="hover:text-red-500 transition-all"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action is a permenant one and cannot be <b className="text-red-500">undone !</b>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={()=>handleDelete(id)}>Proceed</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>  
                          </td>
                          </tr> 
                      )
                    }
                    else {}
                  }    
                          )  
                        }   
                </tbody>
            </table>
          }
              
        </div>
        <div className='flex justify-center pb-10 mt-10'>
            {   pageCount > 0 &&
                pages.map((number,index) => 
                <button 
                    key={index}
                    onClick={()=>setPage(number)} 
                    className={page === number
                    ? 'px-2 text-white border-2 border-black bg-black mx-1 rounded-lg dark:text-black dark:bg-zinc-200 dark:border-zinc-200' 
                    : `px-2 mx-1 rounded-md shadow-md text-black border border-black hover:bg-black hover:text-white
                    dark:border-zinc-200 dark:text-zinc-200 dark:hover:text-black dark:hover:bg-zinc-200 transition-all`}
                    >{number + 1}
                </button>
                )
            }
        </div>
        <Toaster />
    </div>
  )
}
