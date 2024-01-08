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
  const [unitPrice,setUnitPrice] = useState<number>(0)
  const [message,setMessage] = useState('')
  
  const handleSubmit = async () => {
    
      setMessage("Adding product to the inventory...")
      if (productId === '' || productName === '' || configuration === '' || sourceName === '' || !unitPrice) {
        alert("Invalid input")
        setMessage('')
      } else {
        const status = await addProduct(productId,productName,configuration,sourceName,unitPrice)
        if (status === 200) {
            setMessage("")
            setProductId('')
            setProductName('')
            setConfiguration('')
            setSourceName('')
            setUnitPrice(0)
            toast.success("Product added to the inventory and product's list")
            
        } else if (status === 201) {
          toast.success("Product added to the inventory and product's list")
          setProductId('')
          setProductName('')
          setConfiguration('')
          setSourceName('')
          setUnitPrice(0)
          setMessage('')
        } else if (status === 400) {
          toast.error("Product ID already in use")
          setProductId('')
          setMessage('')
        } else {
          setMessage("Something went wrong")
          setProductId('')
          setProductName('')
          setConfiguration('')
          setSourceName('')
          setUnitPrice(0)
        }
      }
  }
  return (
    <div>
        <h1 className='text-4xl font-bold text-center mt-10'>ADD NEW PRODUCT</h1>
        <div className="border-r-2 border-l-2 flex flex-col w-2/3 mx-auto mt-4 rounded-lg gap-y-8 py-8 pl-64">
            <input 
            placeholder='Product ID'
            className="text-zinc-700 w-1/3 outline-none border-b border-zinc-300
            dark:border-zinc-700 dark:placeholder:text-zinc-700 dark:text-zinc-300 dark:bg-inherit
            focus:border-b-2 focus:border-zinc-700" 
            type="text" 
            value={productId} 
            onChange={(e)=> setProductId(e.target.value)} 
            />
            <input 
            placeholder='Product Name'
            className="text-zinc-700 w-2/3 outline-none border-b border-zinc-300
            dark:border-zinc-700 dark:placeholder:text-zinc-700 dark:text-zinc-300 dark:bg-inherit
            focus:border-b-2 focus:border-zinc-700" 
            type="text" 
            value={productName} 
            onChange={(e)=> setProductName(e.target.value)} 
            />
            <input 
            className="text-zinc-700 w-2/3 outline-none border-b border-zinc-300
            dark:border-zinc-700 dark:placeholder:text-zinc-700 dark:text-zinc-300 dark:bg-inherit
            focus:border-b-2 focus:border-zinc-700" 
            placeholder='Configuration'
            type="text" 
            value={configuration} 
            onChange={(e)=> setConfiguration(e.target.value)} 
            />
            <input 
            className="text-zinc-700 w-2/3 outline-none border-b border-zinc-300
            dark:border-zinc-700 dark:placeholder:text-zinc-700 dark:text-zinc-300 dark:bg-inherit
            focus:border-b-2 focus:border-zinc-700"
            placeholder='Source Name' 
            type="text" 
            value={sourceName} 
            onChange={(e)=> setSourceName(e.target.value)} 
            />
            <input placeholder='Price in BDT' 
            className="text-zinc-700 w-2/3 outline-none border-b border-zinc-300
            dark:border-zinc-700 dark:placeholder:text-zinc-700 dark:text-zinc-300 dark:bg-inherit
            focus:border-b-2 focus:border-zinc-700" 
            type="number" 
            value={unitPrice} 
            onChange={(e)=> setUnitPrice(parseInt(e.target.value))} />
            <p>{message}</p>
            {
              productId === '' || productName === '' || configuration === '' || sourceName === '' || !unitPrice ||
              <AlertDialog>
                    <AlertDialogTrigger 
                    className="mt-2 border-b-2 border-r-2 px-2 py-1 w-1/2 ml-12 rounded-lg transition-all
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
