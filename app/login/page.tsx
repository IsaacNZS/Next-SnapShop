import Auth from "../components/Auth";

const page = () => {
  return (
    <Auth
      footerhref={"/register/"}
      footerlabel={"Don't Have An Account?"}
      formtitle={"Login"}
      showprovider={true}
    />
  );
};

export default page;
