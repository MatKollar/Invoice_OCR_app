import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles({
    pageWrapper: {
        display: "flex",
        minHeight: "100vh"
    },
    contentWrapper: {
        width: "100%",
        backgroundColor: "#B2B2B2",
    },
    content: {
        textAlign: "center",
    },
    invoice: {
        marginTop: "20px",
        width: "35%",
    }
});