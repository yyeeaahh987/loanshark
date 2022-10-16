import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import 'nprogress/nprogress.css';
import App from './App';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import * as serviceWorker from 'src/serviceWorker';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers';

const store = createStore(
  reducers,
  applyMiddleware(ReduxThunk)
);

ReactDOM.render(
  // <Provider store={store}>
    <HelmetProvider>
      <SidebarProvider>
          <App />
      </SidebarProvider>
    </HelmetProvider>,
  // </Provider>,

  document.getElementById('root')
);

serviceWorker.unregister();
