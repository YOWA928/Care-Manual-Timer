import React, { useEffect, useState } from 'react';

import { useNavigate, useParams } from "react-router-dom";
import ReactSlider from 'react-slider';
import './AddEdit.css';
import db from "../firebase";
import { toast } from 'react-toastify';
import { collection, onSnapshot, addDoc, setDoc, doc } from "firebase/firestore";

const initialState = {
  name: "",
  person: "",
  minutes: "",
  memo: ""
};


const AddEdit = () => {
  const [state, setState] = useState(initialState);
  const [data, setData] = useState([]);
  const [sliderValue, setSliderValue] = useState(1);

  const { name, person, memo } = state;
  const navigate = useNavigate();
  const { id } = useParams();


  useEffect(() => {
    const postData = collection(db, "tasks");
    onSnapshot(postData, (snapshot) => {
      const taskData = [];
      snapshot.forEach((doc) => {
        taskData.push({ id: doc.id, ...doc.data() });
      });
      setData(taskData);
    }, [id]);
  }, []);

  useEffect(() => {
    if (id && data.length > 0) {
      const task = data.find((task) => task.id === id);
      if (task) {
        setState({
          name: task.name,
          person: task.person,
          minutes: task.minutes,
          memo: task.memo,
        });
        setSliderValue(task.minutes);
      }
    } else {
      setState({ ...initialState });
      setSliderValue(1);
    }
  }, [id, data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "minutes") {
      setSliderValue(value);
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !person || !sliderValue || !memo) {
      toast.error("全ての項目を入力してください！");
    } else {
      try {
        const taskRef = collection(db, 'tasks');
        if (!id) {
          // 新規データの追加
          const docRef = await addDoc(taskRef, {
            name: name,
            person: person,
            minutes: sliderValue,
            memo: memo
          });
          toast.success("追加しました!");
        } else {
          // 既存データの更新
          const docRef = doc(taskRef, id);
          await setDoc(docRef, {
            name: name,
            person: person,
            minutes: sliderValue,
            memo: memo
          });
          toast.success("更新しました!");
        }
        setTimeout(() => navigate("/"), 500);
      } catch (err) {
        toast.error("エラーが発生しました");
      }
    }
  };

  return (
    <div className="add-form">
      <div className='form-header'>
        <h2 className="form-title">{ id ? 'タスクを更新する' : 'タスクを追加する' }</h2>
      </div>
      <form onSubmit={ handleSubmit }>
        <label htmlFor="name">タスク名</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder='タスク名を入力…'
          value={ name || "" }
          onChange={ handleInputChange }
        />
        <label htmlFor="person">利用者名</label>
        <input
          type="text"
          id="person"
          name="person"
          placeholder='利用者氏名を入力(姓名スペースなし)…'
          value={ person || "" }
          onChange={ handleInputChange }
        />

        <label htmlFor="minutes">タイマーの分数</label>
        <span> : { sliderValue } min</span>
        <ReactSlider
          id="minutes"
          name="minutes"
          className='slider'
          thumbClassName='thumb'
          trackClassName='track'
          value={ sliderValue }
          min={ 1 }
          max={ 60 }
          onChange={ (value) => setSliderValue(value) }
        >
        </ReactSlider>
        <label htmlFor="memo">マニュアル</label>
        <textarea
          id="memo"
          name="memo"
          placeholder='マニュアルテキストを入力…'
          value={ memo || "" }
          onChange={ handleInputChange }
        />
        <button type='submit' className='btn-main'>{ id ? '更新する' : '追加する' }</button>
      </form>
    </div>
  );
};

export default AddEdit;