"use server"

export const cart = async (accessToken : string | null) => {
        const res = await fetch(`http://localhost:5000/cart?accessToken=${accessToken}`,{cache : "no-store"})
        const result = await res.json()
        if (res.status === 200) {
                return result
        } else {
                return []
        }        
}