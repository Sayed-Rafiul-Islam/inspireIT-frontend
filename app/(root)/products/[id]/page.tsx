'use client'

import { useEffect, useState } from "react"
import './module.product.css'
import { useUserAuth } from "../../context/AuthContext"

interface Info {
  product_name : string,
  configuration : string,
  source_name : string,
  unit_price : number
}
interface ProductIds {
  product_id : string,
}

export default function Product({params} : any) {

    const {logout} = useUserAuth()
    const [info,setInfo] = useState<Info | null>(null)
    const [productIds,setProductIds] = useState([])
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(0);
    const pages = Array.from(Array(pageCount).keys())


    useEffect(()=>{
      const accessToken = localStorage.getItem("accessToken")
      const getPageCount = async () => {
        if (info) {
          const {product_name,configuration,source_name,unit_price} = info
          const res = await fetch(`http://localhost:5000/productsPageCount?product_name=${product_name}&configuration=${configuration}&source_name=${source_name}&unit_price=${unit_price}&accessToken=${accessToken}`)
          const status = res.status
          if (status === 401 || status === 403) {
              logout()
          } else {
            const data = await res.json()
            setPageCount(data)
          }
          
        }
          
      }
      getPageCount();
  },[page,info])

    useEffect(()=>{
      const accessToken = localStorage.getItem("accessToken")
        const getInfo = async () => {
            const res = await fetch(`http://localhost:5000/inventoryItem?id=${params.id}&accessToken=${accessToken}`)
            const status = res.status
            if (status === 401 || status === 403) {
                logout()
            } else {
              const data = await res.json()
              setInfo(data)
            }
            
        }
        getInfo();
    },[])

    useEffect(()=>{
        const getProductIds = async () => {
          const accessToken = localStorage.getItem("accessToken")
          if (info) {
            const {product_name,configuration,source_name,unit_price} = info
            const res = await fetch(`http://localhost:5000/productIds?product_name=${product_name}&configuration=${configuration}&source_name=${source_name}&unit_price=${unit_price}&page=${page}&accessToken=${accessToken}`)
            const status = res.status
            if (status === 401 || status === 403) {
                logout()
            } else {
              const data = await res.json()
              setProductIds(data)
            }
            
          }
            
        }
        getProductIds();
    },[page,info])

  return (
    <div>
      {
        info ? 
        <div className="ml-10 mt-8">
          <h1 className="text-4xl font-bold">Product Name : <span>{info.product_name}</span></h1>
          <h2 className="text-2xl font-semibold">Configuration : <span>{info.configuration}</span></h2>
          <p>Source : {info.source_name}</p>
          <p className="font-bold">Price : {info.unit_price} BDT</p>
        </div>
        :
        ''
      }
      <div className="">
        <div className="w-11/12 flex mx-auto">
              <table className="w-full">
                <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Product Id</th>
                </tr>
                </thead>

                <tbody className="text-center">
                {   
              productIds.length !== 0 &&
                  productIds.map(({product_id} : ProductIds,index) => 
                          <tr key={index}>
                            <td>{page*10 + index + 1}</td>
                            <td>{product_id}</td>
                          </tr> 
                          )  
                        }   
                </tbody>
            </table>
        </div>
        <div className='flex justify-center pb-10 mt-2'>
            {   pageCount > 1 &&
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
    </div>
  )
}
