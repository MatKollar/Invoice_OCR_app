import AppLayout from "../../components/AppLayout/AppLayout";
import UploadCard from "../../components/UploadCard/UploadCard";

import { useStyles } from "./styles";

const UploadPage = () => {
  const classes = useStyles();

  return (
    <>
      <AppLayout pageNumber={0}>
        <UploadCard />
        <canvas className={classes.invoice} id="output" />
      </AppLayout>
    </>
  );
};

export default UploadPage;
