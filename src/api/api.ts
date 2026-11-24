import axios from "axios"

const api = axios.create({
  baseURL: "https://to-dos-api.softclub.tj",
})

export async function getTodos() {
  const { data } = await api.get("/api/to-dos")
  return data
}

export async function addTodo(values: any) {
  const formData = new FormData()

  formData.append("name", values.name)
  formData.append("description", values.description)

  const { data } = await api.post("/api/to-dos", formData)

  return data
}

export async function editTodo(values: any) {
  const { data } = await api.put("/api/to-dos", {
    id: values.id,
    name: values.name,
    description: values.description,
  })

  return data
}

export async function deleteTodo(id: number) {
  const { data } = await api.delete("/api/to-dos", {
    params: { id },
  })

  return data
}

export async function changeStatus(id: number) {
  const { data } = await api.put("/completed", null, {
    params: { id },
  })

  return data
}