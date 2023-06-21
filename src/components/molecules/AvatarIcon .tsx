import { Avatar } from "@mui/material";
import { LockOutlined } from "../atoms/icons/Icons";

const AvatarIcon = () => {
  return (
    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
      <LockOutlined />
    </Avatar>
  );
};

export default AvatarIcon;
