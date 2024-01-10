"use client"
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import './module.sellRecord.css'
import accessProvider from '../../actions/accessProvider';
import  logo_white  from '@/image/logo_white.png'
import  logo_gray  from '@/image/logo_gray.png'
import Image from 'next/image';

interface Info {
    product_name : string,
    configuration : string,
    customer_name : string,
    address : string,
    contact_no : string,
    selling_price : number,
    selling_date : string


  }

export default function SellRecord({params} : any) {

    const [info,setInfo] = useState<Info | null>(null)
    const [date,setDate] = useState<string>('')
    const path = usePathname()
    accessProvider(path)

    // get info
    useEffect(()=>{
        const getInfo = async () => {
            const res = await fetch(`http://localhost:5000/sellRecord?id=${params.id}`)
            const data = await res.json()
            setInfo(data)   
            // const date = moment(data.selling_date.split("T")[0],"YYYY-MM-DD").format("DD/MM/YYYY")
            const date = moment(data.selling_date.split("T")[0],"YYYY-MM-DD").format("MMMM Do YYYY")
            setDate(date)
        }
        getInfo();
      },[])

  return (
    <div className='inv-size mx-auto'>
        {
            info &&
            <>
            <div className='relative'>
                <Image height={170} width={170} className='absolute left-16 top-2' src={logo_white} alt=''></Image>
                <div className='top1 w-full bg-black'></div>
                <div className='top2'></div>
                <div className='top1 w-full flex'>
                    <div className='top1 w-1/2 bg-black rounded-br-3xl'></div>
                    <div className='top1 w-1/2 bg-white rounded-tl-3xl'></div>
                </div>
            </div>
            <div className='mx-16'>
                <div className='mt-10 text-black'>
                    <h1 className='text-3xl mb-5'><b>Invoice To</b></h1>
                    <h2 className='text-2xl my-2'><b>Name : </b>{info.customer_name}</h2>
                    <h2 className='text-2xl my-2'><b>Address : </b>{info.address}</h2>
                    <h2 className='text-2xl my-2'><b>Phone Number : </b>{info.contact_no}</h2>
                </div>
                <div className='mt-10 bg-black text-white grid grid-cols-12 text-center'>
                    <h2 className='col-span-3 text-xl py-5'>Serial Number</h2>
                    <h2 className='col-span-6 text-xl py-5'>Product Description</h2>
                    <h2 className='text-xl py-5'>Qty</h2>
                    <h2 className='col-span-2 text-xl py-5'>Price</h2>
                </div>
                
                <div className='invoice-details grid grid-cols-12 text-black'>
                <Image height={250} width={250} className='absolute left-1/3 top-1/4 ml-12' src={logo_gray} alt=''></Image>
                    <div className='bg-gray-300 col-span-3'>
                        <h2 className='text-center text-xl mt-5 font-bold'>{params.id}</h2>
                    </div>
                    <div className='bg-white col-span-6'>
                        <h2 className='mx-5 text-xl mt-5 font-bold z-10'>{info.product_name}</h2>
                    </div>
                    <div className='bg-gray-300'>
                    <h2 className='text-center text-xl mt-5 font-bold'>1</h2>
                    </div>
                    <div className='bg-white col-span-2'>
                        <h2 className='text-center text-xl mt-5 font-bold'>{info.selling_price} BDT</h2>
                    </div>
                </div>
                <div className='invoice-details-bg'></div>
                <div className='mt-5 grid grid-cols-12 w-full'>
                    <div className='col-span-9'>
                        <h2 className='text-2xl text-black ml-5'><span className='font-extrabold'>Date : </span>{date}</h2>
                    </div>
                    <div className='col-span-3'>
                        <h2 className='text-2xl text-black'><span className='font-extrabold'>Total : </span>{info.selling_price} BDT</h2>
                    </div>
                </div>
                <div className='text-black mt-20'>
                    <h2 className='text-2xl my-3'><b>Phone&nbsp;&nbsp;&nbsp;&nbsp;: </b>01329408441, 01329408442, 01329408443</h2>
                    <h2 className='text-2xl my-3'><b>Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </b>inspiredtech2023@gmail.com</h2>
                    <h2 className='text-2xl my-3'><b>Website&nbsp;: </b>www.inspiredtechbd.com</h2>
                    <h2 className='text-2xl my-3'><b>Address&nbsp;: </b>Golden Tower, Jahaj Company More, Rangpur</h2>
                </div>
            </div>
    
            <div className='relative mt-20 mb-20'>
                <div className='absolute border-t-4 border-black right-4 top-0'>
                    <h2 className='text-black font-extrabold text-2xl px-10 py-3'>
                        Shop Owner and Signature with Date
                    </h2>
                </div>
                
                <div className='bottom1 w-full flex'>
                    <div className='bottom1 w-1/2 bg-black rounded-tr-3xl'></div>
                    <div className='bottom1 w-1/2 bg-white rounded-bl-3xl'></div>
                </div>
                <div className='bottom2'></div>
                <div className='bottom1 w-full bg-black'></div>
            </div>
            </>
        }
        
    </div>
  )
}
