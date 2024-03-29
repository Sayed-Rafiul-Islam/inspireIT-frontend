"use client"

import { useEffect, useState } from "react";
import SellRecords from "../sellrecords/page";
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

  const path = usePathname()
  accessProvider(path)
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

    //  page count
    useEffect(()=>{
        const getPageCount = async () => {
            const res = await fetch(`https://inspired-it-backend.vercel.app/api/sellRecordsByDatePageCount?from=${startDate}&to=${endDate}`,
            {cache : 'no-store'})
            const pageCount = await res.json()
            setPageCount(Math.ceil(pageCount))
        }
        
        if (startDate !== '' && endDate !== '') {
            getPageCount();
            setUpdate(!update)
          } 
    },[updatePageCount])

    // Products
    useEffect(()=> {
      const getProducts = async () => {
          const res = await fetch(`https://inspired-it-backend.vercel.app/api/sellRecordsByDate?page=${page}&from=${startDate}&to=${endDate}`,
          {cache : "no-store"}
          )
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
    const res = await fetch(`https://inspired-it-backend.vercel.app/api/addMonthly`, {
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
    <div className="pb-20 lg:mt-0 mt-20">
      <h1 className="text-center text-4xl font-bold my-6">Add Monthly Records</h1>
      <div className="flex lg:flex-row flex-col w-11/12 lg:ml-16 ml-6 my-4">
            <div>
              <label className="text-green-500 mr-2" htmlFor="">From :</label>
              <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="text-red-500 lg:mx-2 mr-2 ml-5" htmlFor="">To :</label> 
              <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} />
            </div>
            <button className="lg:ml-2 ml-14 lg:mt-0 mt-2 lg:w-1/12 w-1/4" onClick={dateSubmit}>Search</button>
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
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{customer_name}</td> 
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{contact_no}</td> 
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{address}</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{product_id}</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{product_name}</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{configuration}</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{buying_price} BDT</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{selling_price} BDT</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{due} BDT</td>
                            <td className="lg:px-0 px-10 border-y border-zinc-400 py-2 dark:border-zinc-700">{moment(selling_date.split("T")[0],"YYYY-MM-DD").format("MMMM Do YYYY")}</td>
                          </tr> 
                        )            
                      }      
                  </tbody>
                </table>
              }             
        </div>
        <div className='flex justify-center pb-10'>
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

        {
          show &&
          <div className="lg:w-1/2 w-11/12 border-r border-b border-zinc-500 mx-auto lg:px-20 px-10 py-6 rounded-lg pb-10 mb-10">
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
                                  <p className="text-md">Total Profit : <b className="text-green-500">{calculation}</b> BDT</p>
                              
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={addToMonthly}>Add to Monthly Records</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
              </AlertDialog>           
              </div>
          </div>
        }
        <Toaster />
    </div>
  )
}
