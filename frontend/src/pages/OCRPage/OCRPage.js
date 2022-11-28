import AppLayout from "../../components/AppLayout/AppLayout";
import SelectCard from "../../components/SelectCard/SelectCard";

import { useStyles } from "./styles";

const OCRPage = () => {
  const classes = useStyles();

  return (
    <>
      <AppLayout pageNumber={2}>
        <SelectCard />
      </AppLayout>
    </>
  );
};

export default OCRPage;
