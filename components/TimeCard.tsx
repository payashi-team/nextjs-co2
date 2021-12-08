import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { formatDate } from "@lib/utils";
import React, { VFC } from "react";
import { alpha } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

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
        color: grey[500],
        backgroundColor: grey[50],
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
        <AccessTimeIcon width={24} height={24} />
      </Box>
      <Typography variant="h3">{formatDate(value)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Time
      </Typography>
    </Card>
  );
};

export default Co2Card;
