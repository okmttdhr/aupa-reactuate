import { React, Route, Application, connect, bindActionCreators } from 'reactuate';
import request from 'superagent';

import utils from 'utils';
import counter from './counter';
import counterAsync from './counter/async';

const App = (props) => <div>{props.children}</div>;
App.propTypes = {
  children: React.PropTypes.element.isRequired,
};

class HomePage extends React.Component {
  static propTypes = {
    actions: React.PropTypes.object.isRequired,
    counter: React.PropTypes.number.isRequired,
  }

  handleIncrement() {
    request
      .get(utils.uriSearch().youtube)
      .query({
        part: 'snippet',
      })
      .end((err, res) => {
        console.log(err);
        console.log(res);
      });
    this.props.actions.incrementCounter();
  }
  handleIncrementDelayed() {
    this.props.actions.incrementCounterDelayed();
  }
  render() {
    return (
      <div>
        <div>
          <h5>Counter example</h5>
          {this.props.counter}
          <button onClick={() => this.handleIncrement()}>Increment</button>
          <button onClick={() => this.handleIncrementDelayed()}>Increment with delay</button>
        </div>
      </div>
    );
  }
}

const ConnectedHomePage = connect(
  state => ({ counter: state.counter.counter }),
  dispatch => ({
    actions: bindActionCreators({ ...counter.actions, ...counterAsync.actions }, dispatch),
  })
)(HomePage);

const routes = (
  <Route component={App}>
    <Route path="/" component={ConnectedHomePage} />
  </Route>
);

new Application({ routes, domains: { counter, counterAsync } }).render();
