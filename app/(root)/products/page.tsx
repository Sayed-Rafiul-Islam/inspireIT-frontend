"use client"

import Link from "next/link";
import { useEffect, useState } from "react"
import { useUserAuth } from "../context/AuthContext";

interface Product {
  id : number,
  product_name : string,
  configuration : string,
  source_name : string,
  unit_price : number,
  quantity : number
}


export default function Products() {

  const {logout} = useUserAuth()
  const [products, setProducts] = useState([])
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const pages = Array.from(Array(pageCount).keys())

      //  page count
      useEffect(()=>{
        const accessToken = localStorage.getItem("accessToken")
        const getPageCount = async () => {
            const res = await fetch(`http://localhost:5000/inventoryPageCount?accessToken=${accessToken}`,{cache : "no-store"})
            const status = res.status
            if (status === 403 || status === 401) {
              logout()
              setProducts([])
          } else {
              const pageCount = await res.json()
              setPageCount(Math.ceil(pageCount))
          }
            
        }
        getPageCount()
    },[])

    // Products
    useEffect(()=> {
      const accessToken = localStorage.getItem("accessToken")
      
      const getProducts = async () => {
          const res = await fetch(`http://localhost:5000/inventory?page=${page}&accessToken=${accessToken}`,{cache : "no-store"})
          const status = res.status
          if (status === 403 || status === 401) {
              logout()
              setProducts([])
          } else {
            const data = await res.json()
            setProducts(data)
          }
          
      }
      getProducts();
  },[page])


  return (
    <div>
        <div className="w-11/12 flex mx-auto">
              <table className="w-full">
                <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Product Name</th>
                  <th>Configuration</th>
                  <th>Source</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                </tr>
                </thead>

                <tbody className="text-center">
                {   
              products.length === 0 ?
              <tr className="text-red-400 text-center text-3xl font-bold">
              <td colSpan={6}>
              No Products Found
              </td>
              
            </tr>
            :
                  products.map(({id,product_name,configuration,source_name,unit_price,quantity} : Product,index) => {
                    if (quantity > 0) {
                      return (
                        <tr key={index}>
                            <td>{page*10 + index + 1}</td>
                            <td><Link href={`/products/${id}`}>{product_name}</Link></td>
                            <td>{configuration}</td>
                            <td>{source_name}</td>
                            <td>{unit_price} BDT</td>
                            <td>{quantity}</td>
                          </tr> 
                      )
                    }
                    else {}
                  }    
                          )  
                        }   
                </tbody>
            </table>
        </div>
        <div className='flex justify-center pb-10'>
            {
                pages.map((number,index) => 
                <button 
                    key={index}
                    onClick={()=>setPage(number)} 
                    className={page === number
                    ? 'px-3 py-1 mx-1 rounded-lg text-white bg-teal-500' 
                    : 'px-2 mx-1 rounded-lg border-2 border-teal-500 text-teal-500 hover:text-white hover:bg-teal-500 transition-all'}
                    >{number + 1}
                </button>
                )
            }
        </div>
    </div>
  )
}
