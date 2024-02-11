import {
  Outlet, useLoaderData,
} from 'react-router-dom';
import HomePage from './views/HomePage/HomePage.jsx';
import {ThemeContextProvider} from './context/theme.context.jsx';

const App = () => {
  const {data} = useLoaderData()
  return <ThemeContextProvider value={data}>
    <Outlet />
  </ThemeContextProvider>
}
App.loader = async () => {
  return {data: {theme: 'dark'}};
}

export const routes = [
  {
    id:"root",
    path: '/',
    loader: App.loader,
    element: <App />,
    children: [
      {
        index :true,
        loader: HomePage.loader,
        element: <HomePage />
      },
    ]
  },

]