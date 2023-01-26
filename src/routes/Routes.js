import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';

export default function RouteWrapper({
  component: Component,
  isPrivate,
  ...rest
}) {

  //usando o context
  const { signed, loading } = useContext(AuthContext);

  //const loading = false;
  /* const signed = false; */

  if (loading) {
    return (
      <div>

      </div>
    )
  }

  //verificação de user is logged, rotas protegidas
  if (!signed && isPrivate) {
    return <Redirect to="/" />
  }

  if (signed && !isPrivate) {
    return <Redirect to="/dashboard" />
  }


  return (
    <Route {...rest}
      render={props => (
        <Component {...props} />
      )} />
  )

}