import withOutAuth from "../../withOutAuth";
import Clock from "../subComponent/globalComponentAsset/Clock";
import FormLogin from "../subComponent/Login/FormLogin";

const Login = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center h-full">
      <div className="mb-4 absolute top-32">
        <h1 className="font-bold text-5xl text-white">Login</h1>
      </div>
      <div className="flex flex-col justify-center items-center mb-4">
        <Clock />
      </div>
      <div className="bg-white h-fit flex flex-col justify-center items-center rounded-lg">
        <FormLogin />
      </div>
    </div>
  );
};

export default withOutAuth(Login);
