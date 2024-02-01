'use client'

import { useEffect, useState } from "react"
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

interface Info {
  product_name : string,
  configuration : string,
  source_name : string,
  unit_price : number,
  import_date : string
}
interface ProductIds {
  product_id : string,
}

export default function Product({params} : any) {

    const [info,setInfo] = useState<Info | null>(null)
    const [productIds,setProductIds] = useState([])
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(0);
    const [update, setUpdate] = useState(false);
    const pages = Array.from(Array(pageCount).keys())


    // get info
    useEffect(()=>{
      const getInfo = async () => {
          const res = await fetch(`https://inspired-it-backend.vercel.app/api/inventoryItem?id=${params.id}`)
          const data = await res.json()
          setInfo(data)   
      }
      getInfo();
    },[])

    // get page count 
    useEffect(()=>{
      const getPageCount = async () => {
        if (info) {
          const {product_name,configuration,source_name,unit_price,import_date} = info
          const res = await fetch(`https://inspired-it-backend.vercel.app/api/productsPageCount?product_name=${product_name}&configuration=${configuration}&source_name=${source_name}&unit_price=${unit_price}&import_date=${import_date}`)
          const data = await res.json()
          setPageCount(data)
        }
      }
        getPageCount();
    },[page,info,update])



    useEffect(()=>{
        const getProductIds = async () => {
          if (info) {
            const {product_name,configuration,source_name,unit_price,import_date} = info
            const res = await fetch(`https://inspired-it-backend.vercel.app/api/productIds?product_name=${product_name}&configuration=${configuration}&source_name=${source_name}&unit_price=${unit_price}&import_date=${import_date}&page=${page}`)
            const data = await res.json()
            setProductIds(data)
          }   
        }
        getProductIds();
    },[page,info,update])

    const handleDelete = async (id : string) => {
          if (info) {
            const {product_name,configuration,source_name,unit_price,import_date} = info
            const res = await fetch(`https://inspired-it-backend.vercel.app/api/product?product_name=${product_name}&configuration=${configuration}&source_name=${source_name}&unit_price=${unit_price}&id=${id}&import_date=${import_date}`, {
              method : "DELETE"
          })
          const status = res.status
          if (status === 200) {
              toast.success(`Product of ID : ${id} removed permenantly !`)
              setUpdate(!update)
          }
        }
      }

  return (
    <div className="pb-20 lg:mt-0 mt-20">
      {
        info ? 
        <div className="ml-16 mt-8 mb-6">
          <h1 className="lg:text-4xl text-2xl font-bold">Product Name : <span>{info.product_name}</span></h1>
          <h2 className="lg:text-2xl text-lg font-semibold">Configuration : <span>{info.configuration}</span></h2>
          <p className="lg:text-md text-sm">Source : {info.source_name}</p>
          <p className="font-bold lg:text-md text-sm">Price : <span className="text-green-500">{info.unit_price}</span> BDT</p>
        </div>
        :
        ''
      }
      <div>
        <div className="w-11/12 flex mx-auto">
          {
            productIds.length === 0 ?
            <h1 className="text-red-500 text-3xl mx-auto">No Products Found</h1>
            :
            <table className="w-full">
                <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Product Id</th>
                </tr>
                </thead>

                <tbody className="text-center">
                {   
                  productIds.map(({product_id} : ProductIds,index) => 
                          <tr className={index%2 === 1 ? 'bg-slate-200 dark:bg-zinc-900' : ''} key={index}>
                            <td className="py-2">{page*10 + index + 1}</td>
                            <td className="py-2">{product_id}</td>
                            <td className="py-2">
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
                                    You want to remove Product of ID <b className="text-green-500">{product_id}</b>
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
    </div>
    <Toaster />
    </div>
  )
}
