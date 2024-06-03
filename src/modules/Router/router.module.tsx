import React, { PropsWithChildren, Suspense, lazy, useLayoutEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux-toolkit/store/store";
import { saveLanguage } from "../../redux-toolkit/slicer/language.slicer";
import loadLanguage from "../../utils/load-language.utils";
import Loader from "../../shared/views/Loader";
import { KanzRoles } from "../../enums/roles.enum";
import { ApplicationStatus } from "../../enums/types.enum";
import { RoutesEnums } from "../../enums/routes.enum";
import { LinkedInCallback } from "react-linkedin-login-oauth2";

// Modules
const Home = lazy(() => import("../Home"));
const Signup = lazy(() => import("../Signup"));
const Verification = lazy(() => import("../EmailVerification"));
const Login = lazy(() => import("../Login"));
const Welcome = lazy(() => import("../Onboarding/Welcome"));
const InvestorFlow = lazy(() => import("../Onboarding/InvestorFlow"));
const CompleteDetails = lazy(() => import("../Onboarding/CompleteDetails"));
const Realtors = lazy(() => import("../Onboarding/RealtorsFlow"));
const CompleteGoals = lazy(() => import("../Onboarding/CompleteGoals"));
const PhilosophyGoals = lazy(() => import("../Onboarding/PhilosophyGoals"));
const AddAttachments = lazy(() => import("../Onboarding/AddAttachments"));
const SyndicateLeadInfo = lazy(() => import("../Onboarding/SyndicateFlow"));
const Startup = lazy(() => import("../Onboarding/StartupFlow"));
const PrivacyPolicy = lazy(() => import("../Policies/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("../Policies/TermsAndConditions"));

const AuthenticateRoute = (props: PropsWithChildren) => {
  const { children } = props;
  const authToken: any = useSelector((state: RootState) => state.auth.value);

  if (authToken) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return <Navigate to="/login" replace />;
};

const AuthenticateAuthRoute = (props: PropsWithChildren | any) => {
  const { children, isVerify = false } = props;
  const user: any = useSelector((state: RootState) => state.user.value);
  const authToken: any = useSelector((state: RootState) => state.auth.value);

  if (!isVerify && !authToken) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  else if (isVerify && !user?.profile_states?.account_confirmed) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return <Navigate to="/welcome" replace />;
};

const AuthenticateRole = (props: PropsWithChildren | any) => {
  const { children } = props;
  const user: any = useSelector((state: RootState) => state.user.value);

  if ((user && (user.type === props.role || props.role === KanzRoles.ALL) && user.status === ApplicationStatus.OPENED || user.status === ApplicationStatus.REOPENED)) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return <Navigate to="/welcome" replace />;
};

const RouterModule = () => {
  const dispatch = useDispatch();
  const authToken: any = useSelector((state: RootState) => state.auth.value);
  const event: any = useSelector((state: RootState) => state.event.value);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    onLoadLanguage();
  }, [event]);

  const onLoadLanguage = async () => {
    try {
      setLoading(true);
      const _language: any = loadLanguage(event);
      dispatch(saveLanguage(_language));
      if (event === "ar") document.documentElement.dir = "rtl";
      else document.documentElement.dir = "ltr";

      const element: HTMLElement | any = document.querySelector('html');
      element.style.fontFamily = event === "ar" ? "'Almarai', sans-serif" : "Roboto, 'Open Sans', 'Helvetica Neue', sans-serif";

    } catch (error) {

    } finally {
      let timer = setTimeout(() => {
        setLoading(false);
        clearTimeout(timer);
      }, 1000);
    }
  };

  return (
    loading ? (<Loader />) : (
      <Routes>
        <Route path="/" element={
          <Suspense fallback={<Loader />}><Home guard={authToken} /></Suspense>
        } />
        <Route path={RoutesEnums.INVESTOR_DETAILS}
          element={
            <Suspense fallback={<Loader />}>
              <AuthenticateRoute>
                <AuthenticateRole role={KanzRoles.INVESTOR}><InvestorFlow guard={authToken} /></AuthenticateRole>
              </AuthenticateRoute>
            </Suspense>
          }
        />
        <Route path="/startup-type/:id"
          element={
            <Suspense fallback={<Loader />}>
              <AuthenticateRoute>
                <AuthenticateRole role={KanzRoles.STARTUP}><Startup guard={authToken} /></AuthenticateRole>
              </AuthenticateRoute>
            </Suspense>
          }
        />
        <Route path={RoutesEnums.REALTOR_DETAILS}
          element={
            <Suspense fallback={<Loader />}>
              <AuthenticateRoute>
                <AuthenticateRole role={KanzRoles.REALTOR}><Realtors guard={authToken} /></AuthenticateRole>
              </AuthenticateRoute>
            </Suspense>
          }
        />
        <Route path="/linkedin" element={<Suspense fallback={<Loader />}><LinkedInCallback /></Suspense>} />
        <Route path="/complete-details"
          element={
            <Suspense fallback={<Loader />}>
              <AuthenticateRoute><CompleteDetails guard={authToken} /></AuthenticateRoute>
            </Suspense>
          }
        />
        <Route path="/complete-goals"
          element={
            <Suspense fallback={<Loader />}>
              <AuthenticateRoute>
                <AuthenticateRole role={KanzRoles.INVESTOR}><CompleteGoals guard={authToken} /></AuthenticateRole>
              </AuthenticateRoute>
            </Suspense>
          }
        />
        <Route path="/philosophy-goals/:id"
          element={
            <Suspense fallback={<Loader />}>
              <AuthenticateRoute><PhilosophyGoals guard={authToken} /></AuthenticateRoute>
            </Suspense>
          }
        />
        <Route path="/add-attachments"
          element={
            <Suspense fallback={<Loader />}>
              <AuthenticateRoute>
                <AuthenticateRole role={KanzRoles.ALL}><AddAttachments guard={authToken} /></AuthenticateRole>
              </AuthenticateRoute>
            </Suspense>
          }
        />
        <Route path="/syndicate-lead/:id"
          element={
            <Suspense fallback={<Loader />}>
              <AuthenticateRoute>
                <AuthenticateRole role={KanzRoles.SYNDICATE}><SyndicateLeadInfo guard={authToken} /></AuthenticateRole>
              </AuthenticateRoute>
            </Suspense>
          }
        />
        <Route path="/signup" element={
          <Suspense fallback={<Loader />}> <AuthenticateAuthRoute><Signup guard={authToken} /></AuthenticateAuthRoute></Suspense>
        } />
        <Route path="/verification" element={
          <Suspense fallback={<Loader />}><AuthenticateAuthRoute isVerify={true}><Verification guard={authToken} /></AuthenticateAuthRoute></Suspense>
        } />
        <Route path="/login" element={
          <Suspense fallback={<Loader />}><AuthenticateAuthRoute><Login guard={authToken} /></AuthenticateAuthRoute></Suspense>
        } />
        <Route path="/welcome" element={
          <Suspense fallback={<Loader />}><AuthenticateRoute><Welcome guard={authToken} /></AuthenticateRoute></Suspense>
        } />
        <Route path="/privacy-policy" element={
          <Suspense fallback={<Loader />}><PrivacyPolicy /></Suspense>
        } />
        <Route path="/terms-and-conditions" element={
          <Suspense fallback={<Loader />}><TermsAndConditions /></Suspense>
        } />
      </Routes>
    )
  );
};
export default RouterModule;
