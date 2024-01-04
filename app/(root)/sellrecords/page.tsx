"use client"

import { useEffect, useState } from "react";

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
  date : string
}

export default function page() {

  const [products, setProducts] = useState([])
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const pages = Array.from(Array(pageCount).keys())

      //  page count
      useEffect(()=>{
        const getPageCount = async () => {
            const response = await fetch(`http://localhost:5000/sellPageCount`)
            const pageCount = await response.json()
            setPageCount(Math.ceil(pageCount))
        }
        getPageCount()
    },[])

    // Products
    useEffect(()=> {
      const getProducts = async () => {
          const res = await fetch(`http://localhost:5000/sellRecords?page=${page}`)
          const products = await res.json()
          setProducts(products)
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
                  <th>Customer Name</th> 
                  <th>Address</th>
                  <th>Contact NO</th>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Configuration</th>
                  <th>Due</th>
                  <th>Buying Price</th>
                  <th>Selling Price</th>
                  <th>Date</th>
                </tr>
                </thead>

                <tbody className="text-center">
                {   
              products.length !== 0 &&
                  products.map(({product_id,customer_name,
                    contact_no,
                    address,
                    product_name,
                    configuration,
                    due,
                    buying_price,
                    selling_price,
                    date} : SellRecords,index) => 
                          <tr key={index}>
                            <td>{page*10 + index + 1}</td>
                            <td>{product_name}</td>
                            <td>{configuration}</td>
                            <td>{product_id}</td>
                            <td>{contact_no}</td> 
                            <td>{customer_name}</td> 
                            <td>{address}</td>
                            <td>{due} BDT</td>
                            <td>{buying_price} BDT</td>
                            <td>{selling_price} BDT</td>
                            <td>{date}</td>
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
