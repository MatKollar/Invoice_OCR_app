import AppLayout from "../../components/AppLayout/AppLayout";
import SelectCard from "../../components/SelectCard/SelectCard";

import { useStyles } from "./styles";

const UploadPage = () => {
  const classes = useStyles();

  return (
    <>
      <AppLayout pageNumber={0}>
        <SelectCard />
        <canvas className={classes.invoice} id="output" />
      </AppLayout>
    </>
  );
};

export default UploadPage;
