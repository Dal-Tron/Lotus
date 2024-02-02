import supabase from "../../../services/db";

const Home = () => {
  // const onClick = async () => {
  //   const { data, error } = await supabase.auth.getSession();
  //   console.log(data, error);
  // };
  return (
    <div className="flex justify-center text-4xl pt-3">Welcome to Lotus!</div>
  );
};

export default Home;
