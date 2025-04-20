import Spinner from "./Spinner";
import { P } from "./Typography";

export const Loading = () => {
  return (
    <div className="r-50 absolute grid h-auto w-screen grid-cols-6 ">
      <div className="col-span-1"></div>
      <div className="col-span-1  mx-auto inline-flex items-center justify-center">
        <P className=" ">Loading…</P> <Spinner />
      </div>
      <div className="col-span-1"></div>
    </div>
  );
};
