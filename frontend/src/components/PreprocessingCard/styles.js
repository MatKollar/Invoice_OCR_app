import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles({
    rootContainer: {
        margin: "0 auto",
        marginTop: 20,
        width: "500px",
        height: "180px",
        borderRadius: 30,
        color: "black",
        backgroundColor: "white",
        boxShadow: "10px 10px 5px #999999",
        position: "relative",
    },
    resetButton: {
        position: "absolute !important",
        top: "2px",
        right: "10px",
    } 
});