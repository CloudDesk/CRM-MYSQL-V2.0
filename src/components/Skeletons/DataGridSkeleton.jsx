import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";

// Dynamic DataGrid Skeleton Component
const DataGridSkeleton = ({ rows = 5, columns = 5, height = 400 }) => {
  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        overflow: "hidden",
        height: `${height}px`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Skeleton */}
      <Box
        sx={{
          display: "flex",
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#f5f5f5",
        }}
      >
        {Array.from(new Array(columns)).map((_, index) => (
          <Skeleton
            key={`header-skeleton-${index}`}
            variant="rectangular"
            width={`${100 / columns}%`}
            height={40}
            animation="wave"
          />
        ))}
      </Box>

      {/* Row Skeletons */}
      <Box sx={{ flexGrow: 1 }}>
        {Array.from(new Array(rows)).map((_, rowIndex) => (
          <Box
            key={`row-skeleton-${rowIndex}`}
            sx={{
              display: "flex",
              borderBottom:
                rowIndex === rows - 1 ? "none" : "1px solid #e0e0e0",
            }}
          >
            {Array.from(new Array(columns)).map((_, colIndex) => (
              <Skeleton
                key={`cell-skeleton-${rowIndex}-${colIndex}`}
                variant="rectangular"
                width={`${100 / columns}%`}
                height={40}
                animation="wave"
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DataGridSkeleton;
