"use server"

export const addProduct = async (
    product_id: string, 
    product_name: string, 
    configuration: string,
    source_name : string, 
    unit_price : number,
    ) => {
    const res = await fetch(`http://localhost:5000/addProduct`, {
        method : "POST",
        headers : {
            "Content-type" : "application/json"
        },
        body : JSON.stringify({product_id,product_name,source_name,configuration,unit_price}),
        cache : "no-store"
    }) 
    const status = res.status
    return status

}
