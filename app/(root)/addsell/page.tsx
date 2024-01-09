"use client"

import { useState } from "react"
import { findProductById } from "../actions/findProductById"
import { addSell } from "../actions/addSell"
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
import accessProvider from "../actions/accessProvider"

interface Product {
  product_id : string,
  product_name : string,
  configuration : string,
  source_name : string,
  unit_price : number
}

export default function AddSell() {
  
  const path = usePathname()
  accessProvider(path)

  const [productId,setProductId] = useState('')
  const [product,setProduct] = useState<Product | null>(null)
  const [customerName,setCustomerName] = useState('')
  const [contactNo,setContactNo] = useState<string>('')
  const [address,setAddres] = useState('')
  const [price,setPrice] = useState<number>(0)
  const [due,setDue] = useState<number>(0)
  const [message,setMessage] = useState('')
  const [sellMessage,setSellMessage] = useState('')
  const input = `text-zinc-700 w-2/3 outline-none border-b border-zinc-300
    dark:border-zinc-700 dark:placeholder:text-zinc-700 dark:text-zinc-300 dark:bg-inherit
    focus:border-b-2 focus:border-zinc-700`

  const clearFields = () => {
    setProductId('')
    setProduct(null)
    setSellMessage('')
    setCustomerName('')
    setContactNo('')
    setAddres('')
    setPrice(0)
    setDue(0)
  }

  const handleSubmit = async () => {
    if (productId === '') {
      setMessage('Enter Product ID')
    } else {
      const {status,product} = await findProductById(productId)
      if(status === 200) {
        setProduct(product)
        setMessage('')
      } else {
        setProduct(null)
        setMessage("No product by that ID in the inventory")
        setProductId('')
      }
    }
   
  }
    const handleSell = async () => {

      setSellMessage("Processing...")
      if (customerName === '' || contactNo === ''  || !price || productId === '') {
        setSellMessage('Invalid Input')
      } else if (product) {
        const data = {
          product_id : productId,
          product_name : product.product_name,
          configuration : product.configuration,
          unit_price : product.unit_price,
          customer_name : customerName,
          contact_no : contactNo,
          address : address,
          selling_price : price,
          due:due,
          source_name : product.source_name,
        }
        const status =  await addSell(data)
        if (status === 200) {
          toast.success('Record Added to the sell Records')
          window.open(`http://localhost:3000/sellrecords/${productId}`, '_ blank')
          clearFields()
        } else if (status === 500) {
          setProductId('')
          setProduct(null)
          setSellMessage('Product ID already in use')
        } else {
          toast.error("Something went wrong ! Try again")
          clearFields()
        }
      }
    }
  return (
    <div className="pb-20 lg:mt-0 mt-20">
      <h1 className='text-4xl font-bold text-center mt-10'>Sell Product</h1>
            <div className="flex flex-col lg:w-1/3 mx-auto mt-5">
                  <input
                    placeholder='Enter Product ID' 
                    className="text-zinc-700 w-1/3 outline-none mx-auto border-b border-zinc-300
                    dark:border-zinc-700 dark:placeholder:text-zinc-700 placeholder:text-center dark:text-zinc-300 dark:bg-inherit
                    focus:border-b-2 focus:border-zinc-700" 
                    type="text" 
                    value={productId} 
                    onChange={(e)=> setProductId(e.target.value)} 
                  />
                  <button className="mt-2 border-b-2 border-r-2 px-2 py-1 w-1/6 mx-auto rounded-lg transition-all
                    hover:shadow-md hover:shadow-zinc-700" 
                    onClick={handleSubmit}
                  >
                    Search
                  </button>
              <p className="mx-auto mt-3 text-red-500">{message}</p>
            </div>

            {
              product &&
              <div className="border-r-2 border-l-2 lg:w-1/2 w-5/6 mx-auto rounded-lg mt-6">
                <div className="pl-12 pt-6">
                    <h1 className="text-2xl lg:text-3xl font-bold">{product.product_name}</h1>
                    <h2 className="text-md lg:text-lg font-semibold text-zinc-600 dark:text-zinc-400">{product.configuration}</h2>
                </div>
                <div className="flex flex-col lg:w-3/4 mt-4 rounded-lg gap-y-8 py-8 pl-12 mb-10">  
                  <input
                    placeholder='Customer Name' 
                    className={input} 
                    type="text" 
                    value={customerName} 
                    onChange={(e)=> setCustomerName(e.target.value)} 
                  />
                  <input
                    placeholder='Contact NO' 
                    className={input} 
                    type="text" 
                    value={contactNo} 
                    onChange={(e)=> setContactNo(e.target.value)} 
                  />
                  <input
                    placeholder='Address' 
                    className={input} 
                    type="text" 
                    value={address} 
                    onChange={(e)=> setAddres(e.target.value)}
                  />
                  <input
                    placeholder='Price in BDT' 
                    className={input}
                    type="number"
                    value={price} 
                    onChange={(e)=> setPrice(parseInt(e.target.value))}
                  />
                  <input
                    placeholder='Due BDT' 
                    className={input} 
                    type="number"
                    value={due} 
                    onChange={(e)=> setDue(parseInt(e.target.value))}
                  />
                  <p className="text-red-500">{sellMessage}</p>
                  <AlertDialog>
                    <AlertDialogTrigger 
                    className="mt-2 border-b-2 border-r-2 px-2 py-1 w-1/2 lg:ml-48 ml-12 rounded-lg transition-all
                    hover:shadow-md hover:shadow-zinc-700"
                    >
                      Sell Product
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Product ID : {productId} <br />
                          Product : {product.product_name} [{product.configuration}] <br />
                          Name : {customerName} <br />
                          contact : {contactNo} <br />
                          {address !== '' && <span>Address : {address} <br /></span>}
                          Selling Price : <span className="text-green-600">{price}</span> <br />
                          { due > 0 && <span>Due : <span className="text-red-600">{due}</span></span> }
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSell}>Continue</AlertDialogAction>
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
