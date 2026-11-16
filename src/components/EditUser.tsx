
import { useFormik } from "formik";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { validateUser } from "../schema";
import { useEditUserMutation } from "../store/redux";

export default function EditUser({ user, onClose }: any) {
  const [editUser, { isLoading }] = useEditUserMutation();

  const formik = useFormik({
    initialValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image,
      status: user.status,
    },

    validate: validateUser,

    onSubmit: async (values) => {
      try {
        await editUser({
          id: user.id,
          ...values,
        }).unwrap();

        onClose();
      } catch (error) {
        console.log(error);
        alert("Failed to edit user");
      }
    },
  });

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit User</DialogTitle>

      <DialogContent>
        <form onSubmit={formik.handleSubmit} className="form-box">
          <TextField
            label="Name"
            name="name"
            fullWidth
            value={formik.values.name}
            onChange={formik.handleChange}
            error={!!formik.touched.name && !!formik.errors.name}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            label="Email"
            name="email"
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            error={!!formik.touched.email && !!formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            label="Phone"
            name="phone"
            fullWidth
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={!!formik.touched.phone && !!formik.errors.phone}
            helperText={formik.touched.phone && formik.errors.phone}
          />

          <TextField
            label="Image URL"
            name="image"
            fullWidth
            value={formik.values.image}
            onChange={formik.handleChange}
            error={!!formik.touched.image && !!formik.errors.image}
            helperText={formik.touched.image && formik.errors.image}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="status"
                checked={formik.values.status}
                onChange={formik.handleChange}
              />
            }
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
