import Link from "next/link";

 

export default function Navbar() {
  return (
        <ul className="flex gap-3 justify-center">
            <li><Link prefetch href='/addsell'>Add Sell</Link></li> 
            <li><Link prefetch href='/addproduct'>Add Product</Link></li>
            <li><Link prefetch href='/updateproduct'>Update Product</Link></li> 
            <li><Link prefetch href='/products'>Products</Link></li>
            <li><Link prefetch href='/sellrecords'>Sell Records</Link></li>
        </ul>
  )
}
