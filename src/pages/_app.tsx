import { withTRPC } from '@trpc/next';
import { AppType } from 'next/dist/shared/lib/utils';
import type { AppRouter } from '../backend/router';
import superjson from "superjson";
import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};
function getBaseUrl() {
  if(typeof window !== "undefined") {
    return "";
  }
  if(process.browser) return "";
  if(process.env.VERCEL_ENV) return `https://${process.env.VERCEL_ENV}`

  return `http://localhost:${process.env.PORT ?? 3001}`;
}

export default withTRPC<AppRouter>({
  config({ ctx }) { 
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      headers() {
          return{
            cookie: ctx?.req?.headers.cookie,
          }
      },
      url,
      transformer: superjson
      /**
       * @link https://react-query-v3.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);