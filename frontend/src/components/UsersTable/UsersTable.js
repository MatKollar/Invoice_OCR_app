import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import StyledTextField from "../StyledComponents/StyledTextField";
import ButtonContained from "../StyledComponents/ButtonContained";
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
      await httpRequest.post(`${process.env.REACT_APP_BACKEND_URL}/edit-role`, {
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
        <StyledTextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearchChange}
          style={{ margin: 10 }}
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
                <ButtonContained
                  color="primary"
                  onClick={(event) => handleEdit(event, params.row)}
                >
                  Edit Role
                </ButtonContained>
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
            "@media (max-width:400px)": {
              width: "250px",
            },
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
          <ButtonContained onClick={handleSave}>Save</ButtonContained>
        </Box>
      </Modal>
    </>
  );
}

export default UsersTable;
