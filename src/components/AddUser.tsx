
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { userSchema } from "../schema";
import { useAddUserMutation } from "../store/redux";

export default function AddUser({ onClose }: any) {
  const [addUser, { isLoading }] = useAddUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      image: "",
      status: true,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await addUser(data).unwrap();
      reset();
      onClose();
    } catch (error) {
      console.log(error);
      alert("Failed to add user");
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add User</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="form-box">
          <TextField
            label="Name"
            fullWidth
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Email"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Phone"
            fullWidth
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />

          <TextField
            label="Image URL"
            fullWidth
            {...register("image")}
            error={!!errors.image}
            helperText={errors.image?.message}
          />

          <FormControlLabel
            control={<Checkbox defaultChecked {...register("status")} />}
            label="Active"
          />

          <div className="form-actions">
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>

            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
