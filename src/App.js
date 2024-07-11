import './App.css';
import { Routes, Route } from "react-router-dom"
import Signup from './components/SignUpScreen/Signup';
import Login from './components/LoginScreen/Login';
import Home from './components/HomeScreen/Home';
import ForgotPassword from './components/ResetPasswordScreen/ForgotPassword';
import NotFound from "./components/NotFound/NotFound"
import Activity from './pages/ActivityScreen/Activity';
import UserProfile from './pages/UserProfile/UserProfile';
import SearchScreen from './pages/SearchScreen/SearchScreen';
import UsersInformation from './pages/UsersInformation/[id]';

function App() {
  return (
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/activity' element={<Activity/>}/>
      <Route path='/search' element={<SearchScreen/>}/>
      <Route path='/account/user/profile' element={<UserProfile/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/account/reset/password' element={<ForgotPassword/>}/>
      <Route path='*' element={<NotFound/>}/>
      <Route path='/user/:userId' element={<UsersInformation/>}/>
     </Routes>
  );
}

export default App;
