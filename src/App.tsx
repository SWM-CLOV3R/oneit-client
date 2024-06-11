import { useEffect, useState } from 'react';

function App() {
  const [statusCode, setStatusCode] = useState<String>("");
  const [isSuccess, setIsSuccess] = useState<Boolean>(false)
  const [error, setError] = useState<String>("")
  const [message, setMessage] = useState<String>("")

  useEffect(() => {
    fetch("/api/hello")
      .then((res:Response) => {
        setStatusCode(res.status.toString());
        return res.json();
      })
      .then((data) => {
        if(data.error){
          setIsSuccess(false);
          setError(data.error);
        }else{
          setMessage(data.message);
          setIsSuccess(true);
          console.log(data);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsSuccess(false);
        setError("Connection Failed");
      });
  }, [])
  

  return (
    <div className="App">
      <header className=' bg-black flex p-3 text-center'>
        <h1 className='text-3xl font-bold text-white'>Hello One!t</h1>
      </header>
      <main className=''>
        <section className='bg-gray-100 p-3'>
          <h2 className='text-2xl font-bold'>API Test</h2>
          {isSuccess ? (
            <div>
              <h3>Connection Success</h3> 
              <p>Status: {statusCode}</p>
              <p>Message: {message}</p>
            </div>
          ): (
            <div>
              <h3>Connection Failed</h3>
              <p>Status {statusCode}</p>
              <p>Error: {error}</p>
            </div>
          )}
          
        </section>
      </main>
    </div>
  );
}

export default App;
