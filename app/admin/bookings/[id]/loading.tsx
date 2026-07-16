import { Loader } from "lucide-react";

export default function Loading() {
    return (
        <div className="w-full min-h-screen flex justify-center items-center">
            <div className="flex space-x-2 justify-center items-center">
               <span> <Loader className="animate-spin"/></span>
               <p>Loading....</p>
            </div>
        </div>
    )
  }
  