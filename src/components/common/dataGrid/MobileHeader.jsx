import { Typography, Box } from "@mui/material";

const styles = {
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'primary.main',
        mb: 1,
    },
    subtitle: {
        color: 'text.secondary',
        fontSize: '14px',
    },
    headerContainer: {
        mt: 2,
        mb: 3,
    },
}
const MobileHeader = ({ title, subtitle }) => {
    return (
        <Box sx={styles.headerContainer}>
            <Typography
                variant="h2"
                style={styles.title}
            >
                {title}
            </Typography>
            <Typography
                variant="subtitle1"
                style={styles.subtitle}
            >
                {subtitle}
            </Typography>
        </Box>
    );
};

export default MobileHeader;
