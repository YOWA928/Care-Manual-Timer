import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import AddEdit from "./pages/AddEdit";
import View from "./pages/View";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Timer from './pages/Timer';
import { TaskProvider } from './components/TaskContext';
import Completed from './pages/Completed';

function App() {

  const [selectedTasksData, setSelectedTasksData] = useState([]);

  return (
    <TaskProvider>
      <BrowserRouter>
        <div className="App">
          <Header></Header>
          <ToastContainer
            position="top-center"
            autoClose={ 5000 }
            hideProgressBar={ true }
            newestOnTop={ false }
            closeOnClick
            rtl={ false }
            pauseOnFocusLoss
            draggable
            theme="colored"
            className="custom-toast"
            style={ { width: '500px', fontSize: '24px', padding: '24px', textAlign: "center" } }
          />
          <Routes>
            <Route path={ '/Care-Manual-Timer' } element={ <Home setSelectedTasksData={ setSelectedTasksData }></Home> }></Route>
            <Route path={ '/add' } element={ <AddEdit></AddEdit> }></Route>
            <Route path={ '/update/:id' } element={ <AddEdit></AddEdit> }></Route>
            <Route path={ '/view/:id' } element={ <View></View> }></Route>
            <Route path={ '/timer' } element={ <Timer selectedTasksData={ selectedTasksData }></Timer> }></Route>
            <Route path={ '/completed' } element={ <Completed></Completed> }></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </TaskProvider >
  );
};

export default App;
