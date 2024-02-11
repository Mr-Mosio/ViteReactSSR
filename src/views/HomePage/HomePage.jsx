import {redirect, useLoaderData, useRouteLoaderData} from 'react-router-dom';
import {useState} from 'react';

const HomePage = () => {
  const {data} = useLoaderData()
  const test = useRouteLoaderData("root")
  const [count, setCount] = useState(0)
  return (
      <div className="text-center text-lg font-semibold h-screen flex flex-col justify-center items-center">
        <h1>{data.title}</h1>
      </div>
  )
}
HomePage.loader = async (req) => {
  return {
    data: {
      title: "Hello World"
    }
  }
}

export default HomePage ;