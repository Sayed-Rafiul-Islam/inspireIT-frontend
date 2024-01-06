"use client"
import React, { useEffect, useState } from 'react'
import { addProduct } from '../actions/addProduct'
import { useUserAuth } from '../context/AuthContext'

export default function AddProduct() {

  const [accessToken,setAccessToken] = useState<string | null>(null)
  const {logout} = useUserAuth()
  const [productId,setProductId] = useState('')
  const [productName,setProductName] = useState('')
  const [configuration,setConfiguration] = useState('')
  const [sourceName,setSourceName] = useState('')
  const [unitPrice,setUnitPrice] = useState<number>(0)
  const [message,setMessage] = useState('')

  useEffect(()=>{
    const access = localStorage.getItem("accessToken")
    setAccessToken(access)
  },[])
  
  const handleSubmit = async () => {
    
      setMessage("Adding product to the inventory...")
      if (productId === '' || productName === '' || configuration === '' || sourceName === '' || !unitPrice) {
        alert("Invalid input")
        setMessage('')
      } else {
        const status = await addProduct(productId,productName,configuration,sourceName,unitPrice,accessToken)
        if (status === 200) {
            setMessage("Product added to the inventory and product's list")
            setProductId('')
            setProductName('')
            setConfiguration('')
            setSourceName('')
            setUnitPrice(0)
            
        } else if (status === 201) {
          setMessage("Product added to the product's list and inventory updated")
          setProductId('')
          setProductName('')
          setConfiguration('')
          setSourceName('')
          setUnitPrice(0)
        } else if (status === 400) {
          setMessage("Product ID already in use")
          setProductId('')
        } else if (status === 401 || status === 403) {
            logout();
        } else {
          setMessage("Something went wrong")
          setMessage("Product added to the product's list and inventory updated")
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
       <div className="bg-indigo-300 flex flex-col w-2/3 mx-auto mt-4 rounded-lg gap-4 py-8 pl-36">
            <label htmlFor="">Product ID : </label>
            <input className="text-black w-1/4" type="text" value={productId} onChange={(e)=> setProductId(e.target.value)} />
            <label htmlFor="">Product Name : </label>
            <input className="text-black w-3/4" type="text" value={productName} onChange={(e)=> setProductName(e.target.value)} />
            <label htmlFor="">Configuration : </label>
            <input className="text-black w-1/6" type="text" value={configuration} onChange={(e)=> setConfiguration(e.target.value)} />
            <label htmlFor="">Source Name : </label>
            <input className="text-black w-1/6" type="text" value={sourceName} onChange={(e)=> setSourceName(e.target.value)} />
            <label htmlFor="">Price : </label>
            <input placeholder='BDT' className="text-black w-1/6" type="number" value={unitPrice} onChange={(e)=> setUnitPrice(parseInt(e.target.value))} />
            {message}
            <button onClick={handleSubmit}>
                Add Product
            </button>
        </div>
    </div>
  )
}
