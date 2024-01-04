export default async function deleteProduct(productId : string,accessToken : string | null) {
    console.log(productId)
    const res = await fetch(`http://localhost:5000/product?productId=${productId}&accessToken=${accessToken}`, {
        method : "DELETE"
    })
   
    return res.status
}