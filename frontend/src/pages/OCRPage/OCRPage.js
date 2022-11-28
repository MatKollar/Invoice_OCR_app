import AppLayout from "../../components/AppLayout/AppLayout";
import OCRCard from "../../components/OCRCard/OCRCard";

import { useStyles } from "./styles";

const OCRPage = () => {
  const classes = useStyles();

  return (
    <>
      <AppLayout pageNumber={2}>
        <OCRCard />
      </AppLayout>
    </>
  );
};

export default OCRPage;
