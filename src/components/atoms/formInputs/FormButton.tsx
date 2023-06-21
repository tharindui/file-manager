import { Button } from "@mui/material";

const FormButton = ({ ...props }) => {
  return <Button fullWidth sx={{ mt: 3, mb: 2 }} {...props} />;
};

export default FormButton;
