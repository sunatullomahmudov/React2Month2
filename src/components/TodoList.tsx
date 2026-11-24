import { useState } from "react"
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import {
  Alert,
  Avatar,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Skeleton,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material"

import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AssignmentIcon from "@mui/icons-material/Assignment"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import PendingActionsIcon from "@mui/icons-material/PendingActions"
import RefreshIcon from "@mui/icons-material/Refresh"
import NotesIcon from "@mui/icons-material/Notes"

import {
  getTodos,
  deleteTodo,
  changeStatus,
} from "../api/api"

import TodoForm from "./TodoForm"

export default function TodoList() {
  const queryClient = useQueryClient()

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [open, setOpen] = useState(false)
  const [selectedTodo, setSelectedTodo] = useState<any>(null)
  const [actionError, setActionError] = useState("")

  const {
    data,
    isPending,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  })

  const { mutate: remove, isPending: deleting } = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      })
    },
    onError: () => {
      setActionError("Failed to delete todo")
    },
  })

  const { mutate: change, isPending: changing } = useMutation({
    mutationFn: changeStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      })
    },
    onError: () => {
      setActionError("Failed to update status")
    },
  })

  const todos = Array.isArray(data?.data) ? data.data : []

  const completed = todos.filter(
    (todo: any) => todo.isCompleted
  ).length

  const pending = todos.length - completed

  const filteredTodos = todos.filter((todo: any) => {
    const text = search.toLowerCase()

    const matchesSearch =
      todo.name?.toLowerCase().includes(text) ||
      todo.description?.toLowerCase().includes(text)

    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && todo.isCompleted) ||
      (filter === "pending" && !todo.isCompleted)

    return matchesSearch && matchesFilter
  })

  function openAdd() {
    setSelectedTodo(null)
    setOpen(true)
  }

  function openEdit(todo: any) {
    setSelectedTodo(todo)
    setOpen(true)
  }

  function closeDialog() {
    setOpen(false)
    setSelectedTodo(null)
  }

  function handleDelete(id: number) {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setActionError("")
      remove(id)
    }
  }

  function handleStatus(id: number) {
    setActionError("")
    change(id)
  }

  return (
    <div className="min-h-screen bg-[#080c18] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">

        <header className="mb-9 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400">
              <AssignmentIcon fontSize="large" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                TaskFlow
              </h1>

              <p className="text-sm text-slate-400">
                Manage your tasks effortlessly
              </p>
            </div>
          </div>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAdd}
            sx={{
              bgcolor: "#6366f1",
              borderRadius: "12px",
              px: 3,
              py: 1.4,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": {
                bgcolor: "#4f46e5",
              },
            }}
          >
            Add New Todo
          </Button>
        </header>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              title: "Total Tasks",
              value: todos.length,
              icon: <AssignmentIcon />,
              color: "text-indigo-400",
              bg: "bg-indigo-500/15",
            },
            {
              title: "Completed",
              value: completed,
              icon: <CheckCircleIcon />,
              color: "text-emerald-400",
              bg: "bg-emerald-500/15",
            },
            {
              title: "Pending",
              value: pending,
              icon: <PendingActionsIcon />,
              color: "text-amber-400",
              bg: "bg-amber-500/15",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-[#141b2b] p-5"
            >
              <div
                className={`rounded-xl p-3 ${item.bg} ${item.color}`}
              >
                {item.icon}
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  {item.title}
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  {item.value}
                </h2>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-[#141b2b] p-4 md:flex-row md:items-center">
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color: "#94a3b8",
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#0c1322",
                color: "white",
                borderRadius: "10px",
                "& fieldset": {
                  borderColor: "#334155",
                },
              },
            }}
          />

          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            size="small"
            sx={{
              minWidth: 155,
              bgcolor: "#0c1322",
              color: "white",
              borderRadius: "10px",
              "& fieldset": {
                borderColor: "#334155",
              },
              "& .MuiSvgIcon-root": {
                color: "#94a3b8",
              },
            }}
          >
            <MenuItem value="all">All Tasks</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>

          <Tooltip title="Refresh">
            <span>
              <IconButton
                onClick={() => refetch()}
                disabled={isFetching}
                sx={{
                  color: "#a5b4fc",
                }}
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>

        {actionError && (
          <Alert
            severity="error"
            onClose={() => setActionError("")}
            sx={{
              mb: 3,
            }}
          >
            {actionError}
          </Alert>
        )}

        {isError && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
            }}
          >
            {error.message}
          </Alert>
        )}

        {isPending ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Skeleton
                key={item}
                variant="rounded"
                height={230}
                sx={{
                  bgcolor: "#1e293b",
                  borderRadius: 4,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredTodos.map((todo: any) => (
              <div
                key={todo.id}
                className="group flex min-h-60 flex-col justify-between rounded-2xl border border-slate-800 bg-[#141b2b] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-950/20"
              >
                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <Avatar
                      sx={{
                        bgcolor: "#312e81",
                        color: "#c7d2fe",
                        width: 40,
                        height: 40,
                      }}
                    >
                      <NotesIcon />
                    </Avatar>

                    <Chip
                      label={
                        todo.isCompleted
                          ? "Completed"
                          : "Pending"
                      }
                      size="small"
                      sx={{
                        bgcolor: todo.isCompleted
                          ? "#064e3b"
                          : "#78350f",
                        color: todo.isCompleted
                          ? "#6ee7b7"
                          : "#fcd34d",
                        fontWeight: 600,
                      }}
                    />
                  </div>

                  <h2 className="mb-2 break-words text-lg font-bold">
                    {todo.name}
                  </h2>

                  <p className="line-clamp-3 break-words text-sm leading-6 text-slate-400">
                    {todo.description || "No description"}
                  </p>
                </div>

                <div>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
                    <span className="text-xs text-slate-500">
                      Task #{todo.id}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        Done
                      </span>

                      <Switch
                        size="small"
                        checked={!!todo.isCompleted}
                        disabled={changing}
                        onChange={() => handleStatus(todo.id)}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => openEdit(todo)}
                      sx={{
                        color: "#a5b4fc",
                        borderColor: "#40447d",
                        borderRadius: "10px",
                        textTransform: "none",
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      disabled={deleting}
                      onClick={() => handleDelete(todo.id)}
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isPending &&
          !isError &&
          filteredTodos.length === 0 && (
            <div className="py-20 text-center">
              <AssignmentIcon
                sx={{
                  fontSize: 55,
                  color: "#475569",
                }}
              />

              <h2 className="mt-3 text-xl font-semibold">
                No tasks found
              </h2>

              <p className="mt-2 text-slate-400">
                Try changing your search or filter.
              </p>
            </div>
          )}

        <TodoForm
          open={open}
          onClose={closeDialog}
          selectedTodo={selectedTodo}
        />
      </div>
    </div>
  )
}