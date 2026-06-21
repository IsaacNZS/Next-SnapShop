import Auth from "../components/Auth";

const page = () => {
  return (
    <Auth
      footerhref={"/login/"}
      footerlabel={"Already Have An Accound?"}
      formtitle={"Register"}
      showprovider={true}
    />
  );
};

export default page;
