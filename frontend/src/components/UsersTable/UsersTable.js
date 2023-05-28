import { useState } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";

function UsersTable({ users, onUserUpdated }) {
  const classes = useStyles();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [search, setSearch] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleEdit = (event, user) => {
    if (user.email === "admin") {
      return;
    }
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleSave = async () => {
    try {
      await httpRequest.post("http://localhost:5000/edit-role", {
        user_id: selectedUser.id,
        role: selectedRole,
      });
      onUserUpdated(selectedUser.id, selectedRole);
      enqueueSnackbar("User role updated successfully", { variant: "success" });
    } catch (error) {
      console.log("Error");
      enqueueSnackbar("An error occurred while updating user role", { variant: "error" });
    }

    setShowModal(false);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const searchString = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchString) ||
      user.email.toLowerCase().includes(searchString) ||
      user.role.toLowerCase().includes(searchString)
    );
  });

  return (
    <>
      <Paper elevation={3} className={classes.paper}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearchChange}
          sx={{ m: 1, width: "25ch" }}
        />
        <DataGrid
          rows={filteredUsers}
          columns={[
            { field: "name", headerName: "Name", flex: 1 },
            { field: "email", headerName: "Email", flex: 1 },
            { field: "role", headerName: "Role", flex: 1 },
            {
              field: "actions",
              headerName: "Actions",
              flex: 1,
              renderCell: (params) => (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(event) => handleEdit(event, params.row)}
                  sx={{
                    backgroundColor: "#854de0",
                    "&:hover": {
                      backgroundColor: "#6336ab",
                    },
                  }}
                >
                  Edit Role
                </Button>
              ),
            },
          ]}
          autoHeight
          sx={{ backgroundColor: "white", marginBottom: "30px" }}
        />
      </Paper>

      <Modal open={showModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Edit Role for {selectedUser?.name}</Typography>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel id="select-role-label">Role</InputLabel>
            <Select
              labelId="select-role-label"
              id="select-role"
              value={selectedRole}
              label="Role"
              onChange={handleRoleChange}
            >
              <MenuItem value="USER">USER</MenuItem>
              <MenuItem value="OWNER">OWNER</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "#854de0",
              "&:hover": {
                backgroundColor: "#6336ab",
              },
            }}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default UsersTable;
