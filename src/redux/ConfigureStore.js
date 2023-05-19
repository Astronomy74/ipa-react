import { createStore, combineReducers, applyMiddleware } from "redux";
import { LoginReducer } from "./loginReducer";
import { InternshipReducer } from "./internshipReducer";
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
  }

const rootReducer = combineReducers({
StoreLogin: LoginReducer,
StoreInternship: InternshipReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)




export const ConfigureStore = () => {
    const store = createStore(
      persistedReducer,
      applyMiddleware(thunk)
    );
  
    const persistor = persistStore(store)
  
    return { store, persistor }
  }