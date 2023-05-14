import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import httpRequest from "../../httpRequest";
import ChangePasswordModal from "../ChangePasswordModal/ChangePasswordModal";
import ProfileModal from "../ProfileModal/ProfileModal";

const ProfileIcon = () => {
  const [open, setOpen] = useState(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [showProfileOpen, setShowProfileOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleMenuClose = () => {
    setOpen(null);
  };

  const handlePasswordModalOpen = () => {
    setChangePasswordOpen(true);
    setOpen(null);
  };

  const handleClosePasswordModal = () => {
    setChangePasswordOpen(false);
  };

  const handleProfileModalOpen = () => {
    setShowProfileOpen(true);
    setOpen(null);
  };

  const handleCloseProfileModal = () => {
    setShowProfileOpen(false);
  };

  const logoutUser = async () => {
    await httpRequest.post("//localhost:5000/logout");
    window.location.href = "/login";
  };

  return (
    <>
      <IconButton sx={{ p: 0.1, color: "white" }} onClick={handleMenuOpen}>
        <AccountCircleIcon fontSize="large" />
      </IconButton>
      <Menu anchorEl={open} open={Boolean(open)} onClose={handleMenuClose}>
        <MenuItem onClick={handleProfileModalOpen}>Profile</MenuItem>
        <MenuItem onClick={handlePasswordModalOpen}>Change password</MenuItem>
        <MenuItem onClick={logoutUser}>Log out</MenuItem>
      </Menu>
      <ChangePasswordModal open={changePasswordOpen} onClose={handleClosePasswordModal} />
      <ProfileModal open={showProfileOpen} onClose={handleCloseProfileModal} />
    </>
  );
};

export default ProfileIcon;
