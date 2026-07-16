"use server"
import { createClient } from "@/util/supabase/server"


interface credentials{
    email:string
    password:string
}
export async function login(loginData:credentials){
   try {
      const supabase=await createClient();

      const {data,error}=await supabase.auth.signInWithPassword({
        email:loginData.email,
        password:loginData.password
      })

      if(error){
        console.log("Unable to login user",error);
        throw error.message
      }
      return {success:true,message:"Logged in successfully"}
   } catch (error) {
      return {success:true,error}
     
   }
}