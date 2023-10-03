import { type } from "os"

export type CounterPersonnel = {
    transactionType: {
        id: number | null,
        name: string
    }| null
    id: number | null
    firstname: string
    lastname: string
    password: string
    username: string
    tag: string
    isActive:boolean
}

export type consumerTransaction ={

   
    subTransactionType: {
        id:number | null
        name:string
    } 

    transactionStatus:{
        id:number | null
        name:string
    } 

    transactionType:{
        id:Number | null
        name:string
    } 

    consumerPriority:{
        id:number | null
        name:string
    } 

    counterPersonnel:{
        transactionType: {
            id: number | null,
            name: string
        }
        
        id: number | null
        firstname: string
        lastname: string
        password: string
        username: string
        tag: string
        isActive:boolean
    }

    id: number
    date: string
    timeGeneratedQueue: string
    name: string
    timeStartTransaction: number
    timeEndTransaction: number
    accountNumber: string
    applicationNumber: string

}

export type TransactionType = {
    id: number | null
    name: string
}


// export type CounterPersonnelpost = {
//     id:number
//     firstname:string
//     lastname:string
//     username:string
//     password:string
//     transactionType: number
// }