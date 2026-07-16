"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { createClient } from "@/util/supabase/client";
import type { Addon } from "@/types/addon";
import { Label } from "@/components/ui/label";

interface AddonFormDialogProps {
  initialData?: Addon;
  onSuccess: () => void;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const AddonFormDialog: React.FC<AddonFormDialogProps> = ({
  initialData,
  onSuccess,
  open,
  setOpen,
}) => {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Addon>({
    defaultValues: initialData || {
      price: 0,
      description: "",
      name: "",
    },
  });

  useEffect(() => {
    reset(
      initialData || {
        price: 0,
        description: "",
        name: "",
      }
    );
  }, [initialData, reset]);

  const onSubmit = async (data: Addon) => {
    setLoading(true);
    const { error } = await supabase.from("add_on").upsert(data);
    setLoading(false);

    if (error) {
      alert("Failed to save addon: " + error.message);
    } else {
      onSuccess();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Update Addon" : "Create Addon"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
            <Label htmlFor="img_url">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter name"
              {...register("name", { required: true })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="price">Price (£)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price"
              {...register("price", { required: true })}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="Enter description"
              {...register("description", { required: true })}
            />
          </div>

        

          {initialData?.id && <input type="hidden" {...register("id")} />}

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Addon"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddonFormDialog;
