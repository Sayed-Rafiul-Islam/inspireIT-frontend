"use client"

import { useEffect, useState } from "react";
import SellRecords from "../sellrecords/page";
import { useUserAuth } from "../context/AuthContext";
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

  const {logout,setActive} = useUserAuth()
  const path = usePathname()
  const [accessToken,setAccessToken] = useState<string | null>(null)
  const [products, setProducts] = useState([])
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [startDate,setStartDate] = useState('')
  const [endDate,setEndDate] = useState('')
  let [buyingPrice,setBuyingPrice] = useState(0)
  let [sellingPrice,setSellingPrice] = useState(0)
  let [totalDue,setTotalDue] = useState(0)
  const [employeeBill,setEmployeeBill] = useState<number>(0)
  const [additionalCosts,setAdditionalCosts] = useState<number>(0)
  const [calculation,setCalculation] = useState<null | number>(null)
  const [update,setUpdate] = useState(false)
  const [updatePageCount,setUpdatePageCount] = useState(false)
  const [show,setShow] = useState(false)
  const pages = Array.from(Array(pageCount).keys())


  useEffect(()=>{
    const access = localStorage.getItem("accessToken")
    setAccessToken(access)
    setActive(path)
  },[])

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
            if (products.length) {
              products.map(({
                  buying_price,
                  selling_price,
                  due} : SellRecords)=>{
                      buyingPrice = buyingPrice + buying_price
                      sellingPrice = sellingPrice + selling_price
                      totalDue= totalDue + due
                      
              })
            }
            setBuyingPrice(buyingPrice)
            setSellingPrice(sellingPrice)
            setTotalDue(totalDue)

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
        toast.success("Monthly Record Added")
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
    setShow(false)
}
  const dateSubmit = () => {
    if (startDate === '' || endDate === '') {
        alert("Enter Date")
    } else {
        setUpdatePageCount(!updatePageCount)
        setBuyingPrice(0)
        setSellingPrice(0)
        setTotalDue(0)
        setShow(true)
        
    }
}

  return (
    <div>
      <h1 className="text-center text-4xl font-bold my-6">Add Monthly Records</h1>
      <div className="w-11/12 mx-auto">
            <label className="text-green-500 mr-2" htmlFor="">From :</label>
            <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
            <label className="text-red-500 mx-2" htmlFor="">To :</label> 
            <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} />
            <button className="ml-2" onClick={dateSubmit}>Submit</button>
        </div>
        <div className="w-11/12 flex mx-auto">
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
                    products.length === 0 ?
                    <tr className="text-red-400 text-center text-3xl font-bold">
                      <td className="mt-36" colSpan={8}>
                      No Records Found
                      </td> 
                    </tr>
                    :
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
                          <tr className={index%2 === 1 ? 'bg-slate-200 dark:bg-zinc-900' : ''} key={index}>
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{page*10 + index + 1}</td>
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{customer_name}</td> 
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{contact_no}</td> 
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{address}</td>
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{product_id}</td>
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{product_name}</td>
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{configuration}</td>
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{buying_price} BDT</td>
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{selling_price} BDT</td>
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{due} BDT</td>
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{selling_date.split("T")[0]}</td>
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
        {
            show &&
        <div className="w-1/2 border-r border-b border-zinc-500 mx-auto px-20 py-6 rounded-lg pb-10 mb-10">
            <div className="flex justify-between">
              <h2 className="">Total Sold :</h2>
              <p ><span className="text-green-600">{sellingPrice}</span> BDT</p>
            </div>
            <div className="flex justify-between">
              <h2 className="">Total Bought :</h2>
              <p className="">{buyingPrice} BDT</p>
            </div>
            <div className="flex justify-between">
              <h2 className="">Total Due : </h2>
              <p><span className="text-red-600">{totalDue}</span> BDT</p>
            </div>
            <div className="flex justify-between">
              <h2 >Total Employee Bill :</h2>
              <input className="text-zinc-700 w-1/6 outline-none border-b border-zinc-300
            dark:border-zinc-700 dark:placeholder:text-zinc-700 dark:text-zinc-300 dark:bg-inherit
            focus:border-b-2 focus:border-zinc-700 place-content-end" type="number" value={employeeBill} onChange={e=>setEmployeeBill(parseInt((e.target.value)))} />
            </div>
            <div className="flex justify-between">
              <h2 className="">Additional Costs :</h2>
              <input className="text-zinc-700 w-1/6 outline-none border-b border-zinc-300
            dark:border-zinc-700 dark:placeholder:text-zinc-700 dark:text-zinc-300 dark:bg-inherit
            focus:border-b-2 focus:border-zinc-700" type="number" value={additionalCosts} onChange={e=>setAdditionalCosts(parseInt(e.target.value))} />
            </div>
            <div className="flex justify-between w-full gap-x-10 mt-6">
            <button className="mt-2 border-b-2 border-r-2 px-2 py-1 w-1/2 rounded-lg transition-all
                    hover:shadow-md hover:shadow-zinc-700 " onClick={handleClearFields}>Clear Fields
            </button>
            <AlertDialog>
                    <AlertDialogTrigger 
                    className="mt-2 px-2 py-1 w-1/2 rounded-lg transition-all
                    hover:shadow-md hover:shadow-zinc-700 bg-black text-white dark:bg-zinc-300 dark:text-black"
                    onClick={()=>setCalculation(sellingPrice - buyingPrice - employeeBill - additionalCosts)}
                    >
                      Calculate
                    </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Calculations of the Records</AlertDialogTitle>
                              <AlertDialogDescription>
                                <p>Total remaining Due : <span className="text-red-500">{totalDue}</span> BDT</p>
                                <p>Total Bought : {buyingPrice} BDT</p>
                                <p>Total Sold : {sellingPrice} BDT</p>
                                <p>Employee Costs : {employeeBill} BDT</p>
                                <p>Additional Costs : {additionalCosts} BDT</p>
                                <p className="text-md">Total remaining Due : <b className="text-green-500">{calculation}</b> BDT</p>
                            
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={addToMonthly}>Add to Monthly Records</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
            </AlertDialog>
            
            </div>
            {/* {
                calculation !== null && 
                <div>
                    <h1>Total Profit : {calculation}</h1>
                    <button onClick={addToMonthly}>Add to Monthly Records</button>
                </div>
                
            } */}
        </div>
        }
        <Toaster />
    </div>
  )
}
