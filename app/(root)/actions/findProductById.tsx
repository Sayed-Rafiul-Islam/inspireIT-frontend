"use server"

export const findProductById = async (id: string) => {

    const res = await fetch(`http://localhost:5000/api/products?id=${id}`,{cache : 'no-store'})
    const status = res.status
    if (status === 200) {
        const product = await res.json()
        return {product,status}
    } else {
        return {status, product : null}
    }
    

}
