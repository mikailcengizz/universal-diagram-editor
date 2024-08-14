import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className="w-full text-center mt-24">
      <h1 className="text-2xl font-bold">Oops!</h1>
      <p className="mt-2">Sorry, an unexpected error has occurred.</p>
      <p className="mt-2">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}