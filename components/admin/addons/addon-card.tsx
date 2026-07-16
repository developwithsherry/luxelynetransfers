import React, { useState } from "react";
import type { Addon } from "@/types/addons";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Loader } from "lucide-react";
import { createClient } from "@/util/supabase/client";
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
interface AddonCardProps {
    addon: Addon;
    onEdit: (addon: Addon) => void;
    onDelete: (addon: Addon) => void;
}

const AddonCard: React.FC<AddonCardProps> = ({ addon, onEdit, onDelete }) => {
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const handleDelete = async () => {
        setDeleteLoading(true)
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("addons")
                .update({ "is_deleted": true })
                .eq("id", addon.id);

            if (error) {
                throw error.message
            }
            toast.success("Addon deleted");
            onDelete(addon);
            setAlertOpen(false)
        } catch (error) {
            toast.error("Unable to delete addon")
        }
        finally {
            setDeleteLoading(false)
        }
    }
    return (
        <>
            <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-md mb-4">
                    <span className="text-gray-400">{addon.name}</span>
                </div>

                <div className="mb-2">
                    <p className="text-sm text-gray-600 truncate">Description: {addon.description}</p>
                    <p className="text-sm font-semibold text-black">Price: £{addon.price}</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(addon)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() =>setAlertOpen(true)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Addon</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. 
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant={"ghost"} onClick={()=>setAlertOpen(false)}>Cancel</Button>
                        <AlertDialogAction
                         onClick={handleDelete}
                         disabled={deleteLoading}
                        >{
                            deleteLoading?
                           <>
                           <Loader className="mr-2"/>
                            Deleting...
                           </> 
                            :"Delete"
                        }</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AddonCard;
