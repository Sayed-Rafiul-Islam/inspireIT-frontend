"use server"

interface Data {
    product_id: string, 
    product_name: string, 
    configuration: string,
    unit_price : number,
    customer_name : string,
    contact_no : string,
    address : string,
    selling_price : number,
    due : number,
    source_name : string,
    import_date : string
}

export const addSell = async (data : Data) => {
    const res = await fetch(`http://localhost:5000/api/addSell`, {
        method : "POST",
        headers : {
            "Content-type" : "application/json"
        },
        body : JSON.stringify(data),
        cache : "no-store"
    }) 
    const status = res.status
    return status

}
