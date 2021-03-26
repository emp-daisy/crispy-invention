import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import RepositoryDetail from '../repository-detail/repository-detail';
import RepositoryList from '../repository-list/repository-list';
import RepositoryProfile from '../repository-profile/repository-profile';
import './main.scss';

const Main = () => {
  return (
    <>
    <div className="contributors__header">
      <h3 className="contributors__header--title">
        <Link to="/">AngulaRank</Link>
      </h3>
    </div>
    <Switch>
      <Route path="/" component={RepositoryList} exact/>
      <Route path="/:username" component={RepositoryProfile} exact/>
      <Route path="/:username/:repo" component={RepositoryDetail} exact/>
    </Switch>
    </>
  );
}

export default Main;
