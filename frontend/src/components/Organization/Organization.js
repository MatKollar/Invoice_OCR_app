const Organization = (props) => {
  const orgData = props.dataFromDB;
  return <div>INVITE CODE: {orgData.invite_code}</div>;
};

export default Organization;
