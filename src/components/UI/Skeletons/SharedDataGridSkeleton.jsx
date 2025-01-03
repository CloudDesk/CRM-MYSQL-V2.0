import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  useGridApiContext,
  useGridSelector,
  gridPageSelector,
  gridPageCountSelector,
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
      disabled
    />
  );
}

const SharedDataGridSkeleton = ({
  title = "Loading",
  subtitle = "Fetching records",
}) => {
  // Generate skeleton columns
  const skeletonColumns = [
    {
      field: "id",
      headerName: "",
      width: 50,
      renderCell: () => (
        <Skeleton variant="rectangular" width={30} height={20} />
      ),
    },
    {
      field: "col1",
      headerName: "",
      flex: 1,
      renderCell: () => <Skeleton variant="text" width="80%" />,
    },
    {
      field: "col2",
      headerName: "",
      flex: 1,
      renderCell: () => <Skeleton variant="text" width="80%" />,
    },
    {
      field: "col3",
      headerName: "",
      flex: 1,
      renderCell: () => <Skeleton variant="text" width="80%" />,
    },
  ];

  // Generate skeleton rows
  const skeletonRows = Array(10)
    .fill(0)
    .map((_, index) => ({
      id: index,
      col1: "Loading",
      col2: "Loading",
      col3: "Loading",
    }));

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        height: "100%",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h2"
            sx={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "primary.main",
              mb: 1,
            }}
          >
            <Skeleton width={200} height={40} variant="rectangular" />
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "text.secondary",
              fontSize: "14px",
            }}
          >
            <Skeleton width={300} height={20} variant="rectangular" />
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton
            variant="rectangular"
            width={100}
            height={40}
            sx={{ borderRadius: "4px" }}
          />
          <Skeleton
            variant="rectangular"
            width={100}
            height={40}
            sx={{ borderRadius: "4px" }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          height: "calc(100vh - 170px)",
          width: "100%",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          overflow: "hidden",
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #f0f0f0",
            "&:focus": {
              outline: "none",
            },
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f8f9fa",
            borderBottom: "2px solid #e9ecef",
            "& .MuiDataGrid-columnHeader": {
              "&:focus": {
                outline: "none",
              },
            },
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "white",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "2px solid #e9ecef",
            backgroundColor: "#f8f9fa",
          },
          "& .odd-row": {
            backgroundColor: "#f8f9fa",
          },
          "& .even-row": {
            backgroundColor: "#ffffff",
          },
        }}
      >
        <DataGrid
          rows={skeletonRows}
          columns={skeletonColumns}
          loading={true}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          components={{
            Pagination: CustomPagination,
          }}
          checkboxSelection
          disableSelectionOnClick
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
          }
          sx={{
            height: "100%",
            "& .MuiDataGrid-cell": {
              opacity: 0.5,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default SharedDataGridSkeleton;
