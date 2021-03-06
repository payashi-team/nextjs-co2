import Co2Icon from "@mui/icons-material/Co2";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { formatNumber } from "@lib/utils";
import React, { VFC } from "react";
import { alpha } from "@mui/material/styles";
import { red } from "@mui/material/colors";

type Props = {
  value: number;
};

const Co2Card: VFC<Props> = ({ value }) => {
  return (
    <Card
      sx={{
        boxShadow: "none",
        textAlign: "center",
        padding: (theme) => theme.spacing(5, 0),
        color: red[500],
        backgroundColor: red[50],
      }}
    >
      <Box
        sx={{
          margin: "auto",
          display: "flex",
          borderRadius: "50%",
          alignItems: "center",
          width: (theme) => theme.spacing(8),
          height: (theme) => theme.spacing(8),
          justifyContent: "center",
          marginBottom: 2,
          color: (theme) => theme.palette.primary.dark,
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(
              theme.palette.primary.dark,
              0
            )} 0%, ${alpha(theme.palette.primary.dark, 0.24)} 100%)`,
        }}
      >
        <Co2Icon width={24} height={24} />
      </Box>
      <Typography variant="h3">{formatNumber(value)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        CO2 Concentration (ppm)
      </Typography>
    </Card>
  );
};

export default Co2Card;
