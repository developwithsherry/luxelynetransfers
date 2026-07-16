"use server"

import { createClient } from "@/util/supabase/server"

export async function LogOut(){
    try{
         const supabase=await createClient();
         const {error}=await supabase.auth.signOut();

         if(error){
              throw error.message

         }
         return {success:true,error:null}
    }
    catch(error){
         return {error:error}
    }
}