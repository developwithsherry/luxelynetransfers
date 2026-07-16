"use server"

import { Addon } from "@/types/addon";
import { createClient } from "@/util/supabase/server"

export async function getAddons(){
    try {
           const supabase=await createClient();
           const {data,error}=await supabase
           .from("add_on")
           .select("*")

           if(error){
             console.log("Error in getting the addons",error)
             throw error.message;
           }
           return {data:data as Addon[]}
    } catch (error) {
          return {error}
    }
}