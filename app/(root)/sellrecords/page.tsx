"use client"

import { useEffect, useState } from "react";
import { useUserAuth } from "../context/AuthContext";

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

  const {logout} = useUserAuth()
  const [products, setProducts] = useState([])
  const [update,setUpdate] = useState(false)
  const [search,setSearch] = useState('')
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const pages = Array.from(Array(pageCount).keys())

      //  page count
      useEffect(()=>{
        const accessToken = localStorage.getItem("accessToken")
        const getPageCount = async () => {
            const res = await fetch(`http://localhost:5000/sellPageCount?accessToken=${accessToken}`,{cache : 'no-store'})
            const status = res.status
            if (status === 401 || status === 403) {
              logout()
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
          const res = await fetch(`http://localhost:5000/sellRecords?page=${page}&search=${search}&accessToken=${accessToken}`,
          {cache : "no-store"}
          )
          const status = res.status
          if (status === 401 || status === 403) {
            logout()
          }
          else if (status === 404) {
            setProducts([])
          } else if (status === 200) {
            const products = await res.json()
          setProducts(products)
          }
      }
      getProducts();
  },[page,update])

  
      const handleSearch = () => {
            setUpdate(!update)
      }
      const clearSearch = () => {
        setSearch('')
        setUpdate(!update)
      }

  return (
    <div>
        <div className="flex">
            <input className="w-1/4" placeholder="Product ID / Customer Name / Contact NO" type="text" value={search} onChange={e=>setSearch(e.target.value)} /><br />
            <button className="ml-2" onClick={handleSearch}>Search</button>
        </div>
        <button onClick={clearSearch}>Clear Search</button>
        <div className="w-11/12 flex mx-auto">
              <table className="w-full">
                <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Customer Name</th> 
                  <th>Contact NO</th>
                  <th>Address</th>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Configuration</th>
                  <th>Buying Price</th>
                  <th>Selling Price</th>
                  <th>Due</th>
                  <th>Date</th>
                </tr>
                </thead>

                <tbody className="text-center">
                {   
              products.length === 0 ? 
              <tr className="text-red-400 text-center text-3xl font-bold">
                <td colSpan={11}>
                No Records Found
                </td>
                
              </tr>
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
                          <tr key={index}>
                            <td>{page*10 + index + 1}</td>
                            <td>{customer_name}</td> 
                            <td>{contact_no}</td> 
                            <td>{address}</td>
                            <td>{product_id}</td>
                            <td>{product_name}</td>
                            <td>{configuration}</td>
                            <td>{buying_price} BDT</td>
                            <td>{selling_price} BDT</td>
                            <td>{due} BDT</td>
                            <td>{selling_date.split("T")[0]}</td>
                          </tr> 
                          )  
                  }
                       
                        </tbody>
              </table>
        </div>
        <div className='flex justify-center pb-10'>
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
  )
}
