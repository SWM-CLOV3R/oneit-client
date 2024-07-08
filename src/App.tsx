import React, {Suspense } from 'react';
import { BrowserRouter as Router, Route , Routes} from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import Header from './components/common/Header';
import NotFound from './pages/NotFound';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import Footer from './components/common/Footer';

const Main = React.lazy(() => import('./pages/Main'));
const Quiz = React.lazy(()=> import('./pages/Quiz'))
const Results = React.lazy(()=> import('./pages/Results'))

function App() {

  // const fetchTodo = async () => {
  //   return (await axios.get('/todos/1')).data
  // }
  // const {data} = useQuery({queryKey:['todo'],queryFn:fetchTodo})
  // console.log(data)


  return (
    <div className='App flex justify-center'>
      <div className="App h-svh flex flex-col justify-between max-w-sm items-center">
        <Header/>
        <main className='h-[85svh] flex w-svw justify-center mb-3 mt-3 max-w-sm'>
          <div className='flex justify-center w-[90%] h-full '>
            <Suspense fallback={<Spinner size="large" />}>
              <Router>
                  <Routes>
                      <Route path="/quiz/:chatID/:currentDepth" element={<Quiz/>} />
                      <Route path="/result/:chatID" element={<Results/>} />
                      <Route path="/" element={<Main/>}/>
                      <Route path="*" element={<NotFound />} />
                  </Routes>
              </Router>
            </Suspense>
          </div>
        </main>
        <Footer/>
      </div>
    </div>
  );
}

export default App;
