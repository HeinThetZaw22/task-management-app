import { Box, Skeleton } from "@mui/material";

const TaskLoadingSkeleton = ({ length = 4 }: { length?: number }) => {
  return (
    <Box component="ul" sx={{ listStyle: "none", p: 0, mt: 2 }}>
      {Array.from({ length }).map((_, i) => (
        <Box
          key={i}
          component="li"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            py: 1,
          }}
        >
          <Skeleton variant="circular" width={24} height={24} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default TaskLoadingSkeleton;
