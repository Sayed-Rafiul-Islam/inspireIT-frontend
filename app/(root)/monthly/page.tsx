"use client"

import { useEffect, useState } from "react"
import { useUserAuth } from "../context/AuthContext"
import { usePathname } from "next/navigation"

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

interface Records {
    monthly_record_id : number,
    bought : number,
    sold : number,
    due : number,
    employee: number,
    additionals: number,
    profit: number,
    record_date: string
}

export default function MonthlyRevenue() {
    const [accessToken,setAccessToken] = useState<string | null>(null)
    const {logout,setActive} = useUserAuth()
    const path = usePathname()
    const [month,setMonth] = useState('01')
    const [year,setYear] = useState('')
    const [records,setRecords] = useState([])


    useEffect(()=>{
      setActive(path)
      const varify = async () => {
          const access = localStorage.getItem("accessToken")
          setAccessToken(access)
          const res = await fetch(`http://localhost:5000/varify?accessToken=${access}`,{cache : "no-store"})
          const status = res.status
          if (status === 401 || status === 403) {
            logout()
          }
      }
      varify()
    },[])

    const dateSubmit = async () => {
        if (year === '') {
            alert("Enter Date")
        } else {
            const date = month + "/" + year
            const res = await fetch(`http://localhost:5000/monthlyRecords?record_date=${date}&accessToken=${accessToken}`,{cache : "no-store"})
            const status = res.status
          if (status === 401 || status === 403) {
            logout()
          }
          else if (status === 200) {
                const records = await res.json()
                setRecords(records)
            }

        }
    }

    const handleDelete = async (id : number) => {
 
      const accessToken = localStorage.getItem("accessToken")
      const res = await fetch(`http://localhost:5000/monthlyRecord?id=${id}&accessToken=${accessToken}`, {
        method : "DELETE"
    })
    const status = res.status
    if (status === 200) {
        toast.success(`Monthly record of ID : ${id} removed permenantly !`)
        dateSubmit()
    }
  
}



  return (
    <div>
      <h1 className="text-center text-4xl font-bold my-6">Monthly Records</h1>
       <div className="flex w-11/12 mx-auto my-5 items-center">
            <div>
                <select name="month" onChange={(e)=>setMonth(e.target.value)}>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
            </div>
            <div className="mx-6">
              <input className="text-zinc-700 outline-none border-b border-zinc-300
                dark:border-zinc-700 dark:placeholder:text-zinc-700 dark:text-zinc-300 dark:bg-inherit
                focus:border-b-2 focus:border-zinc-700 placeholder:text-center" 
                placeholder="Year" 
                type="text" 
                value={year} 
                onChange={(e)=>setYear(e.target.value)} 
              />
            </div>
            <button className="border-b-2 border-r-2 px-6 py-1 rounded-lg transition-all
                    hover:shadow-md hover:shadow-zinc-700" 
                    onClick={dateSubmit}>
                    Search
            </button>

       </div>
       <div className="w-11/12 mx-auto">
       <table className="w-full">
                <thead>
                <tr>
                  <th className="py-2">Serial No</th>
                  <th className="py-2">Bought</th> 
                  <th className="py-2">Sold</th>
                  <th className="py-2">Employee Bill</th>
                  <th className="py-2">Additional Costs</th>
                  <th className="py-2">Dues</th>
                  <th className="py-2">Profits</th>
                  <th className="py-2">Record ID</th>
                  <th className="py-2">Date</th>
                </tr>
                </thead>

                <tbody className="text-center">
                {   
              records.length === 0 ?
              <tr className="text-red-400 text-center text-3xl font-bold">
              <td className="mt-36" colSpan={8}>
              No Records Found
              </td>
              
            </tr>
            :
                  records.map(({
                    monthly_record_id,
                    bought,
                    sold,
                    employee,
                    additionals,
                    due,
                    profit,
                    record_date} : Records,index) => 
                          <tr className={index%2 === 1 ? 'bg-slate-200 dark:bg-zinc-900' : ''} key={monthly_record_id}>
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{index + 1}</td>
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{bought} BDT</td> 
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{sold} BDT</td> 
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{employee} BDT</td>
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{additionals} BDT</td>
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{due} BDT</td>
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{profit} BDT</td>
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{monthly_record_id}</td>
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">{record_date}</td>
                            <td className="border-y border-zinc-400 py-2 dark:border-zinc-700">
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
                                    You want to delete monthly record of ID : <b className="text-red-500">{monthly_record_id}</b><br />
                                    This action is a permenant one and cannot be <b className="text-red-500">undone !</b>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={()=>handleDelete(monthly_record_id)}>Proceed</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>  
                            </td>
                          </tr> 
                          )  
                        }
                        
                        </tbody>
              </table>
       </div>
       <Toaster />
    </div>
  )
}
