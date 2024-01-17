"use client"

import { useEffect, useState } from "react";
import moment from 'moment';
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
import Link from "next/link";

interface SellRecords {
  product_id : string,
  customer_name: string,
  contact_no: number,
  address : string,
  product_name : string,
  configuration : string,
  due : number,
  buying_price : number,
  selling_price : number,
  selling_date : string
}

export default function SellRecords() {

  const path = usePathname()
  accessProvider(path)
  const [products, setProducts] = useState([])
  const [update,setUpdate] = useState(false)
  const [search,setSearch] = useState('')
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [dueOnly, setDueOnly] = useState(false);
  const pages = Array.from(Array(pageCount).keys())

      //  page count
      useEffect(()=>{
        const getPageCount = async () => {
            const res = await fetch(`http://localhost:5000/api/sellPageCount?due=${dueOnly}`,{cache : 'no-store'})
              const pageCount = await res.json()
              setPageCount(Math.ceil(pageCount))
        }
        getPageCount()
    },[dueOnly])

    // Sell Records
    useEffect(()=> {
      const getProducts = async () => {
          const res = await fetch(`http://localhost:5000/api/sellRecords?due=${dueOnly}&page=${page}&search=${search}`,
          {cache : "no-store"}
          )
          const status = res.status
          if (status === 404) {
            setProducts([])
          } else if (status === 200) {
            const products = await res.json()
          setProducts(products)
          }
      }
      getProducts();
  },[page,update,dueOnly])

  
      const handleSearch = () => {
            setUpdate(!update)
      }
      const clearSearch = () => {
        setSearch('')
        setUpdate(!update)
      }

      const handleDelete = async (id : string) => {
        const res = await fetch(`http://localhost:5000/api/sellRecords?id=${id}`, {
          method : "DELETE"
      })
      const status = res.status
      if (status === 200) {
          toast.success(`Sell Record for Product of ID : ${id} removed permenantly !`)
          setUpdate(!update)
         
      }
    
  }

  return (
    <div className="pb-20 lg:mt-0 mt-20">
        <h1 className="text-4xl font-bold text-center my-6">Sell Records</h1>
        <div className="flex justify-between w-11/12 mx-auto my-6">
            <div className="flex lg:flex-row flex-col lg:w-5/6 w-1/2">
                <input className="text-zinc-700 lg:w-1/3 w-full outline-none border-b border-zinc-300
                        dark:border-zinc-700 dark:placeholder:text-zinc-700 dark:text-zinc-300 dark:bg-inherit
                        focus:border-b-2 focus:border-zinc-700" 
                        placeholder="Product ID / Customer Name / Contact NO" 
                        type="text" 
                        value={search} 
                        onChange={e=>setSearch(e.target.value)} />
                <button className="lg:mx-5 mt-2 border-b-2 border-r-2 px-2 py-1 rounded-lg transition-all
                        hover:shadow-md hover:shadow-zinc-700 lg:w-1/6 w-1/2" onClick={handleSearch}>Search</button>
                <button className="mt-2 border-b-2 border-r-2 px-2 py-1 rounded-lg transition-all
                        hover:shadow-md hover:shadow-zinc-700 lg:w-1/6 w-2/3" onClick={clearSearch}>Clear Search</button>
            </div>
            <button 
            onClick={()=>setDueOnly(!dueOnly)}
            className='border-b border-green-500 px-2 h-12 rounded-sm hover:text-green-500 transition-all lg:w-1/6 w-1/3 lg:mt-0 mt-10'>{dueOnly ? "Showing Due Records" : "Showing All Records"}</button>
        </div>
        <div className="lg:w-11/12 flex mx-auto lg:overflow-auto overflow-x-scroll">
          {
            products.length === 0 ?
            <h1 className="text-red-500 text-3xl mx-auto">No Records Found</h1>
            :
            <table className="w-full">
                <thead>
                <tr>
                  <th className="py-2">Serial No</th>
                  <th className="py-2">Customer Name</th> 
                  <th className="py-2">Contact NO</th>
                  <th className="py-2">Address</th>
                  <th className="py-2">Product ID</th>
                  <th className="py-2">Product Name</th>
                  <th className="py-2">Configuration</th>
                  <th className="py-2">Buying Price</th>
                  <th className="py-2">Selling Price</th>
                  <th className="py-2">Due</th>
                  <th className="py-2">Date</th>
                </tr>
                </thead>

              <tbody className="text-center">
                {                
                  dueOnly ?
                          products.map(({product_id,customer_name,
                            contact_no,
                            address,
                            product_name,
                            configuration,
                            due,
                            buying_price,
                            selling_price,
                            selling_date} : SellRecords,index) => {
                            if (due > 0) {
                              return <tr className={index%2 === 1 ? 'bg-slate-200 dark:bg-zinc-900' : ''} key={index}>
                              <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{page*10 + index + 1}</td>
                              <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">
                                <Link href={`sellrecords/${product_id}`} target="_blank">{customer_name}</Link>
                              </td> 
                              <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{contact_no}</td> 
                              <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{address}</td>
                              <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{product_id}</td>
                              <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{product_name}</td>
                              <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{configuration}</td>
                              <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{buying_price} BDT</td>
                              <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{selling_price} BDT</td>
                              <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{due} BDT</td>
                              <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{moment(selling_date.split("T")[0],"YYYY-MM-DD").format("MMMM Do YYYY")}</td>
                              <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">
                                    <AlertDialog>
                                      <AlertDialogTrigger 
                                      className="hover:text-red-500 transition-all"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            You want to sell record of Product ID : <b className="text-green-500">{product_id}</b><br />
                                            This action is a permenant one and cannot be <b className="text-red-500">undone !</b>
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={()=>handleDelete(product_id)}>Proceed</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog> 
                              </td>
                            </tr> 
                            } 
                        } )
                  :
                  products.map(({product_id,customer_name,
                    contact_no,
                    address,
                    product_name,
                    configuration,
                    due,
                    buying_price,
                    selling_price,
                    selling_date} : SellRecords,index) => 
                          <tr className={index%2 === 1 ? 'bg-slate-200 dark:bg-zinc-900' : ''} key={index}>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{page*10 + index + 1}</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">
                                <Link className="hover:text-green-500" href={`sellrecords/${product_id}`} target="_blank">{customer_name}</Link>
                              </td>  
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{contact_no}</td> 
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{address}</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{product_id}</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{product_name}</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{configuration}</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{buying_price} BDT</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{selling_price} BDT</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{due} BDT</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{moment(selling_date.split("T")[0],"YYYY-MM-DD").format("MMMM Do YYYY")}</td>
                            <td className="lg:px-0 border-y border-zinc-400 py-2 dark:border-zinc-700 px-5">
                            <AlertDialog>
                              <AlertDialogTrigger 
                              className="hover:text-red-500 transition-all"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    You want to sell record of Product ID : <b className="text-green-500">{product_id}</b><br />
                                    This action is a permenant one and cannot be <b className="text-red-500">undone !</b>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={()=>handleDelete(product_id)}>Proceed</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog> 
                            </td>
                          </tr> 
                          )
                  }
                </tbody>
            </table>
          }
              
        </div>
        <div className='flex justify-center pb-10 mt-10'>
            {   pageCount > 1 &&
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
