"use server"

export const findProductById = async (id: string) => {

    const res = await fetch(`https://inspired-it-backend.vercel.app/api/products?id=${id}`,{cache : 'no-store'})
    const status = res.status
    if (status === 200) {
        const product = await res.json()
        return {product,status}
    } else {
        return {status, product : null}
    }
    

}
