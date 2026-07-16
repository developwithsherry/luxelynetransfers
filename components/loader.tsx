"use client"
import { Loader2 } from "lucide-react"
interface Props {
    text: string
}
export default function Loader({ text }: Props) {

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-lime-500 mx-auto mb-4" />
                <p className="text-muted-foreground">{text}</p>
            </div>
        </div>
    )
}