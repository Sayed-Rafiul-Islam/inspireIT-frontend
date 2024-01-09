"use client"
import React, { useEffect, useState } from 'react'
import { addProduct } from '../actions/addProduct'
import { useUserAuth } from '../context/AuthContext'
import { usePathname } from 'next/navigation'
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
import accessProvider from '../actions/accessProvider'

export default function AddProduct() {

  const path = usePathname()
  accessProvider(path)
  const [productId,setProductId] = useState('')
  const [productName,setProductName] = useState('')
  const [configuration,setConfiguration] = useState('')
  const [sourceName,setSourceName] = useState('')
  const [date,setDate] = useState('')
  const [unitPrice,setUnitPrice] = useState<number>(0)
  const input = `text-zinc-700 lg:w-2/3 outline-none border-b border-zinc-300
  dark:border-zinc-700 dark:placeholder:text-zinc-700 dark:text-zinc-300 dark:bg-inherit
  focus:border-b-2 focus:border-zinc-700`

  const clearFields = () => {
    setProductId('')
    setProductName('')
    setConfiguration('')
    setSourceName('')
    setUnitPrice(0)
  }
  
  const handleSubmit = async () => {
    
      if (productId === '' || productName === '' || configuration === '' || sourceName === '' || !unitPrice || date === '') {
        toast.error("Invalid input")
      } else {
        const status = await addProduct(productId,productName,configuration,sourceName,unitPrice,date)
        if (status === 200) {
            clearFields()
            toast.success("Product added to the inventory")
            
        } else if (status === 201) {
          toast.success("Product added to the inventory")
          clearFields()

        } else if (status === 400) {
          toast.error("Product ID already in use")
          clearFields()
        } else {
          toast.error("Something went wrong")
          clearFields()
        }
      }
  }
  
  return (
    <div className="pb-20 lg:mt-0 mt-20">
        <h1 className='text-4xl font-bold text-center mt-10'>ADD NEW PRODUCT</h1>
        <div className="border-r-2 border-l-2 flex flex-col w-2/3 mx-auto mt-10 rounded-lg gap-y-8 py-8 lg:pl-64 px-4">
            <input 
            placeholder='Product ID'
            className={input} 
            type="text" 
            value={productId} 
            onChange={(e)=> setProductId(e.target.value)} 
            />
            <input 
            placeholder='Product Name'
            className={input}
            type="text" 
            value={productName} 
            onChange={(e)=> setProductName(e.target.value)} 
            />
            <input 
            className={input}
            placeholder='Configuration'
            type="text" 
            value={configuration} 
            onChange={(e)=> setConfiguration(e.target.value)} 
            />
            <input 
            className={input}
            placeholder='Source Name' 
            type="text" 
            value={sourceName} 
            onChange={(e)=> setSourceName(e.target.value)} 
            />
            <input placeholder='Price in BDT' 
            className={input}
            type="number" 
            value={unitPrice} 
            onChange={(e)=> setUnitPrice(parseInt(e.target.value))} />
            <input type="date" className={input} value={date} onChange={e=> setDate(e.target.value)} />
            {
              productId === '' || productName === '' || configuration === '' || sourceName === '' || !unitPrice || date === '' ||
              <AlertDialog>
                    <AlertDialogTrigger 
                    className="mt-2 border-b-2 border-r-2 px-2 py-1 w-1/2 lg:ml-12 mx-auto rounded-lg transition-all
                    hover:shadow-md hover:shadow-zinc-700"
                    >
                      Sell Product
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Product ID : {productId} <br />
                          Product Name : {productName} <br />
                          Configuration : {configuration} <br />
                          Source : {sourceName} <br />
                          Buying Price : <span className="text-green-600">{unitPrice}</span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
            </AlertDialog>
            }
            
            <Toaster />
        </div>
    </div>
  )
}
