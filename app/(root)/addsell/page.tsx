"use client"

import { useState } from "react"
import { findProductById } from "../actions/findProductById"
import { addSell } from "../actions/addSell"

interface Product {
  product_id : string,
  product_name : string,
  configuration : string,
  source_name : string,
  unit_price : number
}

export default function AddSell() {
  
  const [productId,setProductId] = useState('')
  const [product,setProduct] = useState<Product | null>(null)
  const [customerName,setCustomerName] = useState('')
  const [contactNo,setContactNo] = useState<number>(0)
  const [address,setAddres] = useState('')
  const [price,setPrice] = useState<number>(0)
  const [due,setDue] = useState<number>(0)
  const [message,setMessage] = useState('')
  const [sellMessage,setSellMessage] = useState('')

  const handleSubmit = async () => {
    

    setMessage("Searching...")
    if (productId === '') {
      alert("Enter Product ID")
      setMessage('')
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
      if (customerName === '' || !contactNo  || !price) {
        alert("Fill in the informations")
        setMessage('')
      } else if (product) {
         await addSell(productId,product.product_name,product.configuration,product.unit_price,customerName,address,contactNo,due,price)
      }

    //   if (status === 200) {
    //       setMessage("Product added to the inventory and product's list")
    //       setProductId('')
    //       setProductName('')
    //       setConfiguration('')
    //       setSourceName('')
    //       setUnitPrice(0)
          
    //   } else if (status === 201) {
    //     setMessage("Product added to the product's list and inventory updated")
    //     setProductId('')
    //     setProductName('')
    //     setConfiguration('')
    //     setSourceName('')
    //     setUnitPrice(0)
    //   } else if (status === 400) {
    //     setMessage("Product ID already in use")
    //     setProductId('')
    //   } else {
    //     setMessage("Something went wrong")
    //     setMessage("Product added to the product's list and inventory updated")
    //     setProductId('')
    //     setProductName('')
    //     setConfiguration('')
    //     setSourceName('')
    //     setUnitPrice(0)
    //   }
    // }
    }


  return (
    <div>
      <h1 className='text-4xl font-bold text-center mt-10'>Sell Product</h1>
            <div className="flex flex-col w-1/3 mx-auto mt-5">
              <input placeholder='Enter Product ID' className="text-black w-5/6 mx-auto border-b border-black" type="text" value={productId} onChange={(e)=> setProductId(e.target.value)} />
              <p className="ml-8 mt-4">{message}</p>
              <button className="mt-4 hover:bg-black p-3 hover:text-white w-1/2 mx-auto rounded-lg transition-all" onClick={handleSubmit}>
                  Submit
              </button>
            </div>

            {
              product && 
              <div>
                <div className="ml-64">
                    <h1 className="text-2xl">Product Name : {product.product_name}</h1>
                    <h2 className="text-lg">Configuration : {product.configuration}</h2>
                </div>
                <div className="bg-indigo-300 flex flex-col w-2/3 mx-auto mt-4 rounded-lg gap-4 py-8 pl-36 mb-10">
                  <label htmlFor="">Customer Name : </label>
                  <input className="text-black w-1/4" type="text" value={customerName} onChange={(e)=> setCustomerName(e.target.value)} />
                  <label htmlFor="">Contact NO : </label>
                  <input className="text-black w-3/4" type="text" value={contactNo} onChange={(e)=> setContactNo(parseInt(e.target.value))} />
                  <label htmlFor="">Address : </label>
                  <input className="text-black w-1/6" type="text" value={address} onChange={(e)=> setAddres(e.target.value)} />
                  <label htmlFor="">Price : </label>
                  <input className="text-black w-1/6" type="text" value={price} onChange={(e)=> setPrice(parseInt(e.target.value))} />
                  <label htmlFor="">Due : </label>
                  <input placeholder='BDT' className="text-black w-1/6" type="number" value={due} onChange={(e)=> setDue(parseInt(e.target.value))} />
                  {message}
                  <button className="bg-indigo-500 rounded-lg p-3 w-1/4 ml-64 hover:text-white transition-all" onClick={handleSell}>
                      Sell Product
                  </button>
            </div>
              </div>
            }
    </div>
  )
}
