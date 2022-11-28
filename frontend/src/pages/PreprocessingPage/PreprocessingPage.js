import AppLayout from "../../components/AppLayout/AppLayout";
import PreprocessingCard from "../../components/PreprocessingCard/PreprocessingCard";

import { useStyles } from "./styles";

const PreprocessingPage = () => {
  const classes = useStyles();

  return (
    <>
      <AppLayout pageNumber={1}>
        <PreprocessingCard />
      </AppLayout>
    </>
  );
};

export default PreprocessingPage;
