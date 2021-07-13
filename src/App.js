import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import MainContainer from './containers/MainContainer'
import BlankContainer from './containers/BlankContainer'
/* generales */
import AuthPage from './pages/AuthPage'
import ProductsPremiunPage from './pages/ProductsPremiunPage'
import CategoryPage from './pages/CategoryPage'
import CouponPage from './pages/CouponPage'
import PaymentPage from './pages/PaymentPage'
import ProfilePage from './pages/ProfilePage'
import DashboardPage from './pages/DashboardPage'
import RegisterUser from './pages/RegisterUser'

//import NotFound from './views/NotFound'

const App = () => {
  return(
    <BrowserRouter basename={"/"}>
      <Switch>
        <BlankContainer
          exact
          path="/"
          component={props => (
            <AuthPage {...props}/>
          )}
        />
        <MainContainer>
          <Route exact path="/product_premium" component={ProductsPremiunPage} />
          <Route exact path="/categorys" component={CategoryPage} />
          <Route exact path="/register" component={RegisterUser} />
          <Route exact path="/coupons" component={CouponPage} />
          <Route exact path="/payments" component={PaymentPage} />
          <Route exact path="/dashboard" component={DashboardPage} />
          <Route exact path="/profile" component={ProfilePage} />
        </MainContainer>
      </Switch>
    </BrowserRouter>
  )
}

export default App
