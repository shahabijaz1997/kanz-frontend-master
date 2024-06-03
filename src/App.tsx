import { useLayoutEffect } from "react";
import RouterModule from "./modules/Router/router.module";
import { useDispatch } from "react-redux";
import { CookiesProvider } from "react-cookie";
import { saveOrientation } from "./redux-toolkit/slicer/orientation.slicer";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { getEnv } from "./env";

const ENV: any = getEnv();
const App = () => {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
          const newDirValue: any = document.documentElement.getAttribute('dir');
          dispatch(saveOrientation(newDirValue));
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);
  return <GoogleOAuthProvider clientId={ENV.GOOGLE_API_KEY}> <CookiesProvider><RouterModule /></CookiesProvider></GoogleOAuthProvider>
}

export default App;