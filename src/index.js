import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import './i18n'
// import i18next from 'i18next'
// import { initReactI18next } from 'react-i18next'
// import HttpApi from 'i18next-http-backend'
// import LanguageDetector from 'i18next-browser-languagedetector'
import * as serviceWorker from './serviceWorker';

import App from './components/App';
import reducers from './reducers';

const store = createStore(
  reducers,
  applyMiddleware(ReduxThunk)
);

// i18next
//   .use(HttpApi)
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     supportedLngs: ['en', 'zh', 'fr'],
//     fallbackLng: 'en',
//     debug: false,
//     // Options for language detector
//     detection: {
//       order: ['path', 'cookie', 'htmlTag'],
//       caches: ['cookie'],
//     },
//     react: { useSuspense: false },
//     backend: {
//       loadPath: '/assets/locales/{{language}}/translation.json',
//     },
//   })

//   console.log(i18next)
//   console.log(i18next.language)
//   console.log(i18next.lng)

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
