"use server"
import { createClient } from "@/util/supabase/server"
export async function logout(){
try {
    const supabase=await createClient();
    const {error}=await supabase.auth.signOut();

    if(error){
        console.log("Error in sign out",error)
        throw error.message
    }
    return {success:true}
} catch (error) {
    return {success:false,error}
}
}