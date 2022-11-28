import AppLayout from "../../components/AppLayout/AppLayout";
import SelectCard from "../../components/SelectCard/SelectCard";

import { useStyles } from "./styles";

const PreprocessingPage = () => {
  const classes = useStyles();

  return (
    <>
      <AppLayout pageNumber={1}>
        <SelectCard />
      </AppLayout>
    </>
  );
};

export default PreprocessingPage;
