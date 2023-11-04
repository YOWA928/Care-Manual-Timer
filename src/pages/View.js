import React, { useEffect, useState } from 'react';
import db from "../firebase";
import { collection, deleteDoc, doc, onSnapshot, getDoc } from "firebase/firestore";
import { useParams, Link } from "react-router-dom";
import "./View.css";

const View = () => {
  const [column, setColumn] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const taskRef = doc(db, "tasks", id); // ドキュメントへの参照を取得
    getDoc(taskRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          setColumn({ ...docSnap.data() });
        } else {
          setColumn({});
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
      });
  }, [id]);

  return (
    <div className='review-form'>
      <div className='form-header'>
        <h2 className="form-title">タスクの詳細をみる</h2>
      </div>

      <div className="card">
        <div className="container">
          <strong htmlFor="name">タスク名 :　</strong>
          <span>{ column.name }</span>
          <br />
          <br />
          <strong htmlFor="person">利用者名 :　</strong>
          <span>{ column.person } さん</span>
          <br />
          <br />
          <strong htmlFor="minutes">タイマーの分数 :　</strong>
          <span>{ column.minutes } Min</span>
          <br />
          <br />
          <strong htmlFor="memo">マニュアル :　</strong>
          <p>{ column.memo }</p>
          <br />
          <br />
          <Link to="/">
            <button className='btn btn-edit'>ホームに戻る</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default View;