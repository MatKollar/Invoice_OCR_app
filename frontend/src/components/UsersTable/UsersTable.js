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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";

function UsersTable({ users, onUserUpdated }) {
  const classes = useStyles();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editedRole, setEditedRole] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const handleEdit = (event, user) => {
    if (user.email === "admin@admin.com") {
      return;
    }
    setEditedRole(user.role);
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
      const resp = await httpRequest.post("http://localhost:5000/edit-role", {
        user_id: selectedUser.id,
        role: selectedRole,
      });
      console.log(resp);
      onUserUpdated(selectedUser.id, selectedRole);
    } catch (error) {
      console.log("Error");
    }

    setShowModal(false);
  };

  return (
    <>
      <DataGrid
        rows={users}
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
              >
                Edit Role
              </Button>
            ),
          },
        ]}
        autoHeight
        sx={{ backgroundColor: "white", marginBottom: "30px" }}
      />

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
          <Typography variant="h6">
            Edit Role for {selectedUser?.name}
          </Typography>
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
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default UsersTable;
