"use server"
// interface Order {
//     orderId : number,
//     productId : number,
//     accessToken : string,
//     order_date : string,
//     quantity : number
// }
export const handleCheckout = async (orderId : number,accessToken : string | null, date : string, orders : string,cost : number) => {
    // console.log(order)
    const res = await fetch(`http://localhost:5000/order?accessToken=${accessToken}`, {
        method : "POST",
        headers : {
            "Content-type" : "application/json"
        },
        body : JSON.stringify({orderId,date,orders,cost}),
        cache : "no-store"
    }) 
    return res.status

}