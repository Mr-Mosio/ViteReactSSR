import {Outlet} from 'react-router-dom';

const Layout = () => {
  return <div>
    <Outlet />
  </div>
}
Layout.loader = async () => {
  return {data: {foo: 'bar'}};
}
export default Layout ;