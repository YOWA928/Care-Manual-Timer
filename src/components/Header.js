import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './Header.css';

const Header = () => {
  const [activeTab, setActiveTab] = useState("Home");


  return (
    <header className='header'>
      <div className='logo'>
        <h2>ケアマニュアルタイマー
          <span>
            <img src="" alt="" />
          </span>
        </h2>
      </div>

      <nav>
        <Link to="/Care-Manual-Timer/">
          <p className={ `${activeTab === "Home" ? "active" : ""}` }
            onClick={ () => setActiveTab("Home") }
          >
            タスクを確認する
          </p>
        </Link>
        <Link to="/add">
          <p className={ `${activeTab === "Add" ? "active" : ""} ` }
            onClick={ () => setActiveTab("Add") }
          >
            タスクを追加する
          </p>
        </Link>
        <Link to="/timer">
          <p className={ `${activeTab === "Timer" ? "active" : ""} ` }
            onClick={ () => setActiveTab("Timer") }
          >
            タスクを開始する
          </p>
        </Link>
      </nav>


    </header>

  );
};

export default Header;
