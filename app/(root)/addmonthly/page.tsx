"use client"

import { useEffect, useState } from "react";
import SellRecords from "../sellrecords/page";
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

export default function AddMonthlyRecord() {

  const {logout} = useUserAuth()
  const [accessToken,setAccessToken] = useState<string | null>(null)
  const [products, setProducts] = useState([])
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [startDate,setStartDate] = useState('')
  const [endDate,setEndDate] = useState('')
  let [buyingPrice,setBuyingPrice] = useState(0)
  let [sellingPrice,setSellingPrice] = useState(0)
  let [totalDue,setTotalDue] = useState(0)
  const [employeeBill,setEmploBill] = useState(0)
  const [additionalCosts,setAdditionalCosts] = useState(0)
  const [calculation,setCalculation] = useState<null | number>(null)
  const [update,setUpdate] = useState(false)
  const [updatePageCount,setUpdatePageCount] = useState(false)
  const pages = Array.from(Array(pageCount).keys())


  useEffect(()=>{
    const access = localStorage.getItem("accessToken")
    setAccessToken(access)
  },[])
    useEffect(()=>{
        if (products.length) {
            products.map(({
                buying_price,
                selling_price,
                due} : SellRecords,index)=>{
                    buyingPrice = buyingPrice + buying_price
                    sellingPrice = sellingPrice + selling_price
                    totalDue= totalDue + due
                        
            })
          }
          setBuyingPrice(buyingPrice )
                        
          setSellingPrice(sellingPrice )
          setTotalDue(totalDue )
    },[update,products.length])

    //  page count
    useEffect(()=>{
      const accessToken = localStorage.getItem("accessToken")
        const getPageCount = async () => {
            const res = await fetch(`http://localhost:5000/sellRecordsByDatePageCount?from=${startDate}&to=${endDate}&accessToken=${accessToken}`,
            {cache : 'no-store'})
            const status = res.status
            if (status === 401 || status === 403) {
              logout()
            } else {
              const pageCount = await res.json()
              setPageCount(Math.ceil(pageCount))
            }
        }
        if (startDate !== '' && endDate !== '') {
            getPageCount();
            setUpdate(!update)
          } 
    },[updatePageCount])

    // Products
    useEffect(()=> {
      const accessToken = localStorage.getItem("accessToken")
      const getProducts = async () => {
          const res = await fetch(`http://localhost:5000/sellRecordsByDate?page=${page}&from=${startDate}&to=${endDate}&accessToken=${accessToken}`,
          {cache : "no-store"}
          )
          const status = res.status
          if (status === 401 || status === 403) {
            logout()
          } else {
            const products = await res.json()
            setProducts(products)
          }  
      }

        getProducts();

  },[page,update])

  const addToMonthly = async () => {
    const date = startDate.split("-")[1] + "/" + startDate.split("-")[0]
    const data = {
        sold : sellingPrice,
        bought : buyingPrice,
        due : totalDue,
        employee : employeeBill,
        additionals : additionalCosts,
        profit : calculation,
        record_date : date
    }
    const res = await fetch(`http://localhost:5000/addMonthly?accessToken=${accessToken}`, {
        method : "POST",
        headers : {
            "Content-type" : "application/json"
        },
        body : JSON.stringify(data),
        cache : "no-store"
    }) 
    const status = res.status
    if (status === 200) {
        alert("Record Added")
    } else {
        alert("Something went wrong")
    }
    handleClearFields()
}


  const handleClearFields = () => {
    setStartDate('')
    setEndDate('')
    setUpdate(update)
    setUpdatePageCount(updatePageCount)
    setProducts([])
    setCalculation(null)
}
  const dateSubmit = async () => {
    
    if (startDate === '' || endDate === '') {
        alert("Enter Date")
    } else {
        setBuyingPrice(0)
        setSellingPrice(0)
        setTotalDue(0)
        setUpdatePageCount(!updatePageCount)

    }
}

  return (
    <div>
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
              products.length !== 0 &&
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
        <div>
            <label htmlFor="">From :</label> <br />
            <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} /><br />
            <label htmlFor="">To :</label> 
            <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} />
            <button onClick={dateSubmit}>Submit</button>
        </div>
        {
            products.length > 0 &&
        <div>
            <h2>Total Sold : {sellingPrice}</h2>
            <h2>Total Bought : {buyingPrice}</h2>
            <h2>Total Due : {totalDue}</h2>
            <label htmlFor="">Total Employee Bill :</label>
            <input type="number" value={employeeBill} onChange={e=>setEmploBill(parseInt(e.target.value))} /> <br />
            <input type="number" value={additionalCosts} onChange={e=>setAdditionalCosts(parseInt(e.target.value))} /> <br />
            <button onClick={()=>setCalculation(sellingPrice - buyingPrice - employeeBill - additionalCosts)}>Calculate</button>
            <button onClick={handleClearFields}>Clear Fields</button>
            {
                calculation !== null && 
                <div>
                    <h1>Total Profit : {calculation}</h1>
                    <button onClick={addToMonthly}>Add to Monthly Records</button>
                </div>
                
            }
        </div>
        }
    </div>
  )
}
