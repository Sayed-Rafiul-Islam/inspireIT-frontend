"use server"

export const addSell = async (
    product_id: string, 
    product_name: string, 
    configuration: string,
    unit_price : number,
    customer_name : string,
    address : string,
    contact : number,
    due : number,
    selling_price : number
    ) => {
    const res = await fetch(`http://localhost:5000/addProduct`, {
        method : "POST",
        headers : {
            "Content-type" : "application/json"
        },
        body : JSON.stringify({
            product_id,
            product_name,
            configuration,
            unit_price,
            customer_name,
            address,
            contact,
            due,
            selling_price
        }),
        cache : "no-store"
    }) 
    const status = res.status
    return status

}
