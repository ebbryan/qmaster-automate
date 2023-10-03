import { GetServerSidePropsContext } from "next";

interface Redirect {
  destination: string;
  permanent: boolean;
}

interface AuthResult {
  redirect?: Redirect;
  props?: Record<string, unknown>;
}

export const redirectIfNotAuthenticated = async (
  context: GetServerSidePropsContext
): Promise<AuthResult> => {
  const isAuthenticated = true; // your authentication logic goes here
  if (!isAuthenticated) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
