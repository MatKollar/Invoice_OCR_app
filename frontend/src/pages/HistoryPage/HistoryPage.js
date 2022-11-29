import AppLayout from "../../components/AppLayout/AppLayout";

import { useStyles } from "./styles";

const HistoryPage = () => {
  const classes = useStyles();

  return (
    <>
      <AppLayout pageNumber={2} tabbarDisabled={true}>
        Your scans
      </AppLayout>
    </>
  );
};

export default HistoryPage;
