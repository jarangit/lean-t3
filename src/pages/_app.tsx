import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <div className="w-full max-w-[1400px] mx-auto">
        <Component {...pageProps} />
      </div>
    </ClerkProvider>
  )
};

export default api.withTRPC(MyApp);
