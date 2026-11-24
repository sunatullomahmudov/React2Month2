import { useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material"

import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import SaveIcon from "@mui/icons-material/Save"

import { addTodo, editTodo } from "../api/api"

export default function TodoForm({
  open,
  onClose,
  selectedTodo,
}: any) {
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  })

  useEffect(() => {
    reset({
      name: selectedTodo?.name || "",
      description: selectedTodo?.description || "",
    })
  }, [selectedTodo, open, reset])

  const {
    mutate: add,
    isPending: adding,
    isError: addError,
  } = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      onClose()
    },
  })

  const {
    mutate: edit,
    isPending: editing,
    isError: editError,
  } = useMutation({
    mutationFn: editTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      onClose()
    },
  })

  const saving = adding || editing

  function onSubmit(values: any) {
    if (selectedTodo) {
      edit({ ...values, id: selectedTodo.id })
    } else {
      add(values)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: "#151b2c",
          color: "white",
          border: "1px solid #29334a",
          borderRadius: "20px",
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle className="flex items-center justify-between">
        <div>
          <Typography variant="h6" fontWeight={700}>
            {selectedTodo ? "Edit Todo" : "Create New Todo"}
          </Typography>

          <Typography variant="body2" color="#94a3b8">
            {selectedTodo
              ? "Update your task information"
              : "Add a new task to your workspace"}
          </Typography>
        </div>

        <IconButton
          onClick={onClose}
          disabled={saving}
          sx={{ color: "#94a3b8" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="flex flex-col gap-5">
          {(addError || editError) && (
            <Alert severity="error">
              Something went wrong. Please try again.
            </Alert>
          )}

          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Todo name"
                placeholder="Enter task name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={inputStyle}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                placeholder="Write something about this task..."
                multiline
                rows={4}
                fullWidth
                error={!!errors.description}
                helperText={errors.description?.message}
                sx={inputStyle}
              />
            )}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={onClose}
            disabled={saving}
            sx={{ color: "#94a3b8", textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress size={17} color="inherit" />
              ) : selectedTodo ? (
                <SaveIcon />
              ) : (
                <AddIcon />
              )
            }
            sx={{
              bgcolor: "#6366f1",
              borderRadius: "10px",
              px: 3,
              py: 1.2,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { bgcolor: "#4f46e5" },
            }}
          >
            {saving
              ? "Saving..."
              : selectedTodo
              ? "Save Changes"
              : "Create Todo"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    borderRadius: "12px",
    bgcolor: "#0d1424",
    "& fieldset": { borderColor: "#344158" },
    "&:hover fieldset": { borderColor: "#6366f1" },
  },
  "& .MuiInputLabel-root": {
    color: "#94a3b8",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#818cf8",
  },
}