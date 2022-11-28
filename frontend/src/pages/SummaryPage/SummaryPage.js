import AppLayout from "../../components/AppLayout/AppLayout";

import { useStyles } from "./styles";

const SummaryPage = () => {
  const classes = useStyles();

  return (
    <>
      <AppLayout pageNumber={3}>Summary</AppLayout>
    </>
  );
};

export default SummaryPage;
