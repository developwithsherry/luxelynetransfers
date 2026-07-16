"use client";

import type { Addon } from "@/types/addon";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { getAddons } from "@/app/admin/addons/action";
import { toast } from "sonner";
import AddonsHeader from "./header";
import { Button } from "@/components/ui/button";
import AddonCard from "./addon-card";
import AddonFormDialog from "./addon-dialog";

export function AddOnsClient() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchAddons = async () => {
    setLoading(true);
    try {
      const { data, error } = await getAddons();
      if (error) throw new Error(`${error}`);
      setAddons(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch addons");
    } finally {
      setLoading(false);
    }
  };
  const onDelete = (addon: Addon) => {
    setAddons((prevAddons) => prevAddons.filter(p => p.id != addon.id));
  }
  useEffect(() => {
    fetchAddons();
  }, []);

  const handleEdit = (addon: Addon) => {
    setSelectedAddon(addon);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedAddon(null);
    setDialogOpen(true);
  };

  return (
    <>
      {loading ? (
        <div className="w-full min-h-screen flex flex-col justify-center items-center space-y-2">
          <Loader className="w-6 h-6 animate-spin" />
          <p>Loading addons</p>
        </div>

      ) : (
        <div className="w-full min-h-screen">
          <AddonsHeader />
          <div className="w-full flex justify-end px-4">
            <Button onClick={handleAddNew}>Add new</Button>
          </div>

          <div className="w-full grid my-5 lg:grid-cols-3 grid-cols-1 gap-5 px-2">
            {addons.length > 0 ? (
              addons.map((a) => (
                <AddonCard addon={a} key={a.id} onEdit={handleEdit} onDelete={onDelete} />
              ))
            ) : (
              <div className="w-full flex justify-center items-center">
                <p className="">No addon available</p>
              </div>
            )}
          </div>
        </div>
      )}

      <AddonFormDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        initialData={selectedAddon || undefined}
        onSuccess={fetchAddons}
      />
    </>
  );
}
