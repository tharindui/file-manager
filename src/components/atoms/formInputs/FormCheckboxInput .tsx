import React from "react";
import { FormControlLabel, Checkbox } from "@mui/material";

const FormCheckboxInput = ({ label, ...rest }: { label: string }) => {
  return <FormControlLabel control={<Checkbox {...rest} />} label={label} />;
};

export default FormCheckboxInput;
