
import { useState } from "react";
import {
  Button,
  Checkbox,
  Select,
  MenuItem,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useEditUserMutation,
} from "../store/redux";

import AddUser from "./AddUser";
import EditUser from "./EditUser";

export default function UserList() {
  const { data = [], isLoading, isError, refetch } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();
  const [editUser] = useEditUserMutation();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const [openAdd, setOpenAdd] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState<any>(null);
  const [selectedInfo, setSelectedInfo] = useState<any>(null);

  // SEARCH + SELECT
  const filteredUsers = data.filter((user) => {
    const name = user.name.toLowerCase().includes(search.toLowerCase());

    const active = status === "active" && user.status === true;
    const inactive = status === "inactive" && user.status === false;

    return name && (status === "all" || active || inactive);
  });

  // PAGINATION
  const usersPerPage = 6;
  const pages = Math.ceil(filteredUsers.length / usersPerPage);

  const currentUsers = filteredUsers.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  // DELETE
  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this user?")) {
      try {
        await deleteUser(id).unwrap();
      } catch (error) {
        console.log(error);
        alert("Failed to delete user");
      }
    }
  };

  // STATUS
  const handleStatus = async (user: any) => {
    try {
      await editUser({
        id: user.id,
        status: !user.status,
      }).unwrap();
    } catch (error) {
      console.log(error);
      alert("Failed to change status");
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">
            Manage your users with RTK Query
          </p>
        </div>

        <Button
          variant="contained"
          onClick={() => setOpenAdd(true)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          + Add User
        </Button>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <Select
          size="small"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 155, borderRadius: 2, background: "white" }}
        >
          <MenuItem value="all">All Users</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </div>

      {isLoading && <p className="message">Loading...</p>}

      {isError && (
        <div className="message">
          <p>Failed to load users</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="users-grid">
            {currentUsers.map((user) => (
              <div key={user.id} className="user-card">
                <img
                  src={user.image}
                  alt={user.name}
                  className="user-avatar"
                />

                <h2 className="user-name">{user.name}</h2>
                <p className="user-email">{user.email}</p>
                <p className="user-phone">{user.phone}</p>

                <div className="status-row">
                  <span
                    className={
                      user.status
                        ? "status-badge active"
                        : "status-badge inactive"
                    }
                  >
                    {user.status ? "Active" : "Inactive"}
                  </span>

                  <Checkbox
                    checked={user.status}
                    onChange={() => handleStatus(user)}
                    size="small"
                  />
                </div>

                <div className="card-actions">
                  <Button
                    size="small"
                    onClick={() => setSelectedInfo(user)}
                  >
                    Info
                  </Button>

                  <Button
                    size="small"
                    onClick={() => setSelectedEdit(user)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <p className="message">No users found</p>
          )}

          {pages > 1 && (
            <div className="pagination">
              <Pagination
                count={pages}
                page={Math.min(page, pages)}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
              />
            </div>
          )}
        </>
      )}

      {/* ADD */}
      {openAdd && (
        <AddUser onClose={() => setOpenAdd(false)} />
      )}

      {/* EDIT */}
      {selectedEdit && (
        <EditUser
          user={selectedEdit}
          onClose={() => setSelectedEdit(null)}
        />
      )}

      {/* INFO */}
      <Dialog
        open={!!selectedInfo}
        onClose={() => setSelectedInfo(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>User Information</DialogTitle>

        <DialogContent>
          {selectedInfo && (
            <div className="info-box">
              <img
                src={selectedInfo.image}
                alt={selectedInfo.name}
                className="user-avatar"
              />

              <h2 className="user-name">{selectedInfo.name}</h2>

              <p><b>ID:</b> {selectedInfo.id}</p>
              <p><b>Email:</b> {selectedInfo.email}</p>
              <p><b>Phone:</b> {selectedInfo.phone}</p>
              <p>
                <b>Status:</b>{" "}
                {selectedInfo.status ? "Active" : "Inactive"}
              </p>

              <Button
                variant="contained"
                onClick={() => setSelectedInfo(null)}
                fullWidth
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
