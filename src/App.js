import './App.css';
import DefaultComponent from './components/DefaultComponent';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import React, { Fragment } from 'react';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {
            routes.map((route) => {
              const Page = route.page;
              const Layout = route.isShowHeader || route.isShowFooter ? DefaultComponent : Fragment;
              const exactRoute = route.exact;

              var publicRoutePath;
              if (route.path) {
                publicRoutePath = route.path;
              }

              return (
                <Route
                  key={route.path}
                  path={publicRoutePath}
                  exact={exactRoute}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  } />
              )

            })
          }
        </Routes>
      </Router>
    </div>
  );
}

export default App;
