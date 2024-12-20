import React, {Suspense} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Spinner} from '@/components/ui/spinner';
import Header from './components/common/Header';
import NotFound from './pages/NotFound';
import AuthRouter from './components/common/AuthRouter';
import Navbar from '@/components/common/Navbar';
import {Toaster} from './components/ui/sonner';
import {useParams} from 'react-router-dom';
import FakeLogin from './pages/FakeLogin';
import useApiError from './hooks/useApiError';
import {
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import '@/lib/firebase';
import Landing from './Landing';
import AfterBasketCreate from './pages/Basket/AfterBasketCreate';
import ScrollToTop from './components/common/ScrollToTop';
import Footer from './components/common/Footer';
import GetLocation from './components/common/GetLocation';
import TiemAttackReveal from './pages/TimeAttack/TimeAttackReveal';

// Custom component to handle dynamic redirect
const AuthRouterWithRedirect = ({
    option,
    children,
    redirectTo,
}: {
    option: boolean | null;
    children: React.ReactNode;
    redirectTo: string;
}) => {
    const {basketID, productID, timeAttackID} = useParams();
    let redirect: string = redirectTo;
    if (timeAttackID !== undefined) {
        redirect = redirect.replace(':timeAttackID', timeAttackID);
        return (
            <AuthRouter option={option} redirectTo={redirect}>
                {children}
            </AuthRouter>
        );
    }

    if (basketID !== undefined) {
        redirect = redirect.replace(':basketID', basketID);
    }

    if (productID !== undefined) {
        redirect.replace(':productID', productID);
    }
    return (
        <AuthRouter option={option} redirectTo={redirect}>
            {children}
        </AuthRouter>
    );
    // return (
    //     <AuthRouter option={option} redirectTo={'/main'}>
    //         {children}
    //     </AuthRouter>
    // );
};

const Main = React.lazy(() => import('./pages/Main/Main'));
const Curation = React.lazy(() => import('./pages/Product/Curation'));
const Product = React.lazy(() => import('./pages/Product/Product'));

const About = React.lazy(() => import('./pages/About'));
const Recommend = React.lazy(() => import('./pages/Recommend/Recommend'));
const Quiz = React.lazy(() => import('./pages/Recommend/Quiz'));
const Results = React.lazy(() => import('./pages/Recommend/Results'));

const Login = React.lazy(() => import('./pages/Login/Login'));
const Auth = React.lazy(() => import('./pages/Login/Auth'));
const SignUp = React.lazy(() => import('./pages/Login/SignUp'));
const Mypage = React.lazy(() => import('./pages/Mypage/Mypage'));
const MyBasket = React.lazy(() => import('./pages/Mypage/MyBasket'));
const RecommendRecord = React.lazy(
    () => import('./pages/Mypage/RecommendRecord'),
);
const EditInfo = React.lazy(() => import('./pages/Mypage/EditInfo'));
const Friends = React.lazy(() => import('./pages/Mypage/Friends'));
const User = React.lazy(() => import('./pages/Mypage/User'));

const BasketList = React.lazy(() => import('./pages/Basket/BasketList'));
const Basket = React.lazy(() => import('./pages/Basket/Basket'));
const BasketInfo = React.lazy(() => import('./pages/Basket/BasketInfo'));
const BasketProduct = React.lazy(() => import('./pages/Basket/BasketProduct'));
const CreateBasket = React.lazy(() => import('./pages/Basket/CreateBasket'));
const BasketAddFriend = React.lazy(
    () => import('./pages/Basket/BasketAddFriend'),
);
const BasketInvitation = React.lazy(
    () => import('./pages/Basket/BasketInvitation'),
);

const Discover = React.lazy(() => import('./pages/Discover/Discover'));
const Collection = React.lazy(() => import('./pages/Discover/Collection'));

const Inquiry = React.lazy(() => import('./pages/Inquiry/Inquiry'));
const InquiryChoice = React.lazy(() => import('./pages/Inquiry/InquiryChoice'));
const InquiryResult = React.lazy(() => import('./pages/Inquiry/InquiryResult'));
const AfterInquiry = React.lazy(() => import('./pages/Inquiry/AfterInquiry'));

const TimeAttackList = React.lazy(
    () => import('./pages/TimeAttack/TimeAttackList'),
);
const TimeAttack = React.lazy(() => import('./pages/TimeAttack/TimeAttack'));
const TimeAttackReveal = React.lazy(
    () => import('./pages/TimeAttack/TimeAttackReveal'),
);

function App() {
    const {handleError} = useApiError();

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 0,
            },
            mutations: {
                onError: handleError,
            },
        },
        queryCache: new QueryCache({
            onError: handleError,
        }),
    });
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <div className="App flex flex-col  items-center min-h-screen w-full">
                    <div className="w-[360px] h-full flex-grow flex-shrink flex flex-col">
                        {/* <Header /> */}
                        <>
                            <Suspense fallback={<Spinner size="large" />}>
                                <Router>
                                    <GetLocation />
                                    <ScrollToTop />
                                    <Routes>
                                        <Route
                                            path="/recommend"
                                            element={<Recommend />}
                                        />
                                        <Route
                                            path="/recommend/:chatID/:currentDepth"
                                            element={<Quiz />}
                                        />
                                        <Route
                                            path="/recommend/:chatID/result"
                                            element={<Results />}
                                        />
                                        <Route
                                            path="/product/:productID"
                                            element={<Product />}
                                        />
                                        <Route
                                            path="/curation"
                                            element={<Curation />}
                                        />
                                        {/* <Route
                                            path="/collection"
                                            element={<Discover />}
                                        /> */}
                                        <Route
                                            path="/collection/:collectionID"
                                            element={<Collection />}
                                        />
                                        <Route
                                            path="/basket"
                                            element={
                                                <AuthRouter
                                                    option={true}
                                                    redirectTo="/login?redirect=/basket"
                                                >
                                                    <BasketList />
                                                </AuthRouter>
                                            }
                                        />
                                        <Route
                                            path="/basket/create"
                                            element={
                                                <AuthRouter
                                                    option={true}
                                                    redirectTo="/login?redirect=/basket/create"
                                                >
                                                    <CreateBasket />
                                                </AuthRouter>
                                            }
                                        />
                                        <Route
                                            path="/basket/create/:basketID/after"
                                            element={
                                                <AuthRouter
                                                    option={true}
                                                    redirectTo="/login?redirect=/basket"
                                                >
                                                    <AfterBasketCreate />
                                                </AuthRouter>
                                            }
                                        />
                                        <Route
                                            path="/basket/:basketID"
                                            element={
                                                <AuthRouterWithRedirect
                                                    option={true}
                                                    redirectTo="/login?redirect=/basket/:basketID"
                                                >
                                                    <Basket />
                                                </AuthRouterWithRedirect>
                                            }
                                        />
                                        <Route
                                            path="/basket/:basketID/info"
                                            element={
                                                <AuthRouterWithRedirect
                                                    option={true}
                                                    redirectTo="/login?redirect=/basket/:basketID/info"
                                                >
                                                    <BasketInfo />
                                                </AuthRouterWithRedirect>
                                            }
                                        />

                                        <Route
                                            path="/basket/:basketID/product/:productID"
                                            element={
                                                <AuthRouterWithRedirect
                                                    option={true}
                                                    redirectTo="/login?redirect=/basket/:basketID/product/:productID"
                                                >
                                                    <BasketProduct />
                                                </AuthRouterWithRedirect>
                                            }
                                        />
                                        <Route
                                            path="/basket/:basketID/invite"
                                            element={<BasketAddFriend />}
                                        />
                                        <Route
                                            path="/basket/:basketID/invite/:inviteID"
                                            element={<BasketInvitation />}
                                        />
                                        <Route
                                            path="/inquiry/:inquiryID"
                                            element={<Inquiry />}
                                        />
                                        <Route
                                            path="/inquiry/:inquiryID/choice"
                                            element={<InquiryChoice />}
                                        />
                                        <Route
                                            path="/inquiry/:inquiryID/result"
                                            element={<InquiryResult />}
                                        />
                                        <Route
                                            path="/inquiry/after"
                                            element={<AfterInquiry />}
                                        />
                                        <Route
                                            path="/timeattack"
                                            element={
                                                <AuthRouterWithRedirect
                                                    option={true}
                                                    redirectTo="/login?redirect=/timeattack"
                                                >
                                                    <TimeAttackList />
                                                </AuthRouterWithRedirect>
                                            }
                                        />
                                        <Route
                                            path="/timeattack/:timeAttackID"
                                            element={
                                                <AuthRouterWithRedirect
                                                    option={true}
                                                    redirectTo="/login?redirect=/timeattack/:timeAttackID"
                                                >
                                                    <TimeAttack />
                                                </AuthRouterWithRedirect>
                                            }
                                        />
                                        <Route
                                            path="/timeattack/:timeAttackID/reveal"
                                            element={
                                                <AuthRouterWithRedirect
                                                    option={true}
                                                    redirectTo="/login?redirect=/timeattack/:timeAttackID"
                                                >
                                                    <TimeAttackReveal />
                                                </AuthRouterWithRedirect>
                                            }
                                        />
                                        {/* 
                                        <Route
                                            path="/basket/share/:basketID"
                                            element={<SharedBasket />}
                                        />
                                        
                                        {/* <Route
                                            path="/about"
                                            element={<About />}
                                        /> */}
                                        <Route
                                            path="/login"
                                            element={
                                                <AuthRouter
                                                    option={false}
                                                    redirectTo="/main"
                                                >
                                                    <Login />
                                                </AuthRouter>
                                            }
                                        />
                                        <Route
                                            path="/oauth"
                                            element={
                                                <AuthRouter
                                                    option={false}
                                                    redirectTo="/main"
                                                >
                                                    <Auth />
                                                </AuthRouter>
                                            }
                                        />
                                        <Route
                                            path="/signup"
                                            element={
                                                <AuthRouter
                                                    option={true}
                                                    redirectTo="/main"
                                                >
                                                    <SignUp />
                                                </AuthRouter>
                                            }
                                        />
                                        <Route
                                            path="/mypage"
                                            element={
                                                <AuthRouter
                                                    option={true}
                                                    redirectTo="/login?redirect=/mypage"
                                                >
                                                    <Mypage />
                                                </AuthRouter>
                                            }
                                        />
                                        <Route
                                            path="/mybasket"
                                            element={
                                                <AuthRouter
                                                    option={true}
                                                    redirectTo="/login?redirect=/mybasket"
                                                >
                                                    <MyBasket />
                                                </AuthRouter>
                                            }
                                        />
                                        <Route
                                            path="/recommendRecord"
                                            element={
                                                <AuthRouter
                                                    option={true}
                                                    redirectTo="/login?redirect=/recommendRecord"
                                                >
                                                    <RecommendRecord />
                                                </AuthRouter>
                                            }
                                        />
                                        <Route
                                            path="/mypage/edit"
                                            element={
                                                <AuthRouter
                                                    option={true}
                                                    redirectTo="/login?redirect=/mypage/edit"
                                                >
                                                    <EditInfo />
                                                </AuthRouter>
                                            }
                                        />
                                        <Route
                                            path="/friends"
                                            element={
                                                <AuthRouter
                                                    option={true}
                                                    redirectTo="/login?redirect=/friends"
                                                >
                                                    <Friends />
                                                </AuthRouter>
                                            }
                                        />
                                        <Route
                                            path="/user/:userID"
                                            element={
                                                <AuthRouter
                                                    option={true}
                                                    redirectTo="/login?redirect=/user/:userID"
                                                >
                                                    <User />
                                                </AuthRouter>
                                            }
                                        />
                                        {import.meta.env.DEV && (
                                            <Route
                                                path="/fakeLogin"
                                                element={<FakeLogin />}
                                            />
                                        )}
                                        <Route
                                            path="/main"
                                            element={<Main />}
                                        />

                                        <Route path="/" element={<Landing />} />
                                        <Route
                                            path="/404"
                                            element={<NotFound />}
                                        />
                                        <Route
                                            path="*"
                                            element={<NotFound />}
                                        />
                                        <Route
                                            path="/test"
                                            element={<SignUp />}
                                        />
                                    </Routes>
                                </Router>
                            </Suspense>
                        </>
                    </div>
                </div>
                {/* <Footer /> */}
                <Toaster position="bottom-center" className="z-50" />
                {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </QueryClientProvider>
        </>
    );
}

export default App;
