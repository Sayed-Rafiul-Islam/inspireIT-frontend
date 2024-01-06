"use client"

import { useEffect, useState } from "react"
import { useUserAuth } from "../context/AuthContext"

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
    const {logout} = useUserAuth()
    const [month,setMonth] = useState('01')
    const [year,setYear] = useState('')
    const [records,setRecords] = useState([])

    useEffect(()=>{
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
  return (
    <div>
       <div>
            <div>
            <label htmlFor="">Select Month</label><br />
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
            <div>
                <label htmlFor="">Enter Year</label>
                <input type="text" value={year} onChange={(e)=>setYear(e.target.value)} />
            </div>
            <button onClick={dateSubmit}>Submit</button>
       </div>
       <div>
       <table className="w-full">
                <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Bought</th> 
                  <th>Sold</th>
                  <th>Employee Bill</th>
                  <th>Additional Costs</th>
                  <th>Dues</th>
                  <th>Profits</th>
                  <th>Date</th>
                </tr>
                </thead>

                <tbody className="text-center">
                {   
              records.length === 0 ?
              <tr className="text-red-400 text-center text-3xl font-bold">
              <td colSpan={8}>
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
                          <tr key={monthly_record_id}>
                            <td>{index + 1}</td>
                            <td>{bought} BDT</td> 
                            <td>{sold} BDT</td> 
                            <td>{employee} BDT</td>
                            <td>{additionals} BDT</td>
                            <td>{due} BDT</td>
                            <td>{profit} BDT</td>
                            <td>{record_date}</td>
                          </tr> 
                          )  
                        }
                        
                        </tbody>
              </table>
       </div>
    </div>
  )
}
