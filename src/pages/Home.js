import React, { useState, useContext, useEffect } from 'react';
import db from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import './Home.css';
import { toast } from 'react-toastify';
import { TaskContext } from '../components/TaskContext';

const Home = ({ setSelectedTasksData }) => {
  const [data, setData] = useState([]);
  const { checkedTasks, toggleTaskCheckbox } = useContext(TaskContext);
  const [selectedPerson, setSelectedPerson] = useState('');
  const navigate = useNavigate();

  // 利用者名一覧を収集
  const uniquePersons = [...new Set(data.map(task => task.person))];

  // 利用者名選択用のセレクトボックスの選択肢を生成
  const personSelectOptions = uniquePersons.map((personOption, index) => (
    <option key={ index } value={ personOption }>
      { personOption }
    </option>
  ));

  // 利用者名選択用のセレクトボックスをレンダリング
  <select value={ selectedPerson } onChange={ (e) => setSelectedPerson(e.target.value) }>
    <option value="">利用者で検索する/全て</option>
    { personSelectOptions }
  </select>;



  // Firestoreからデータを読み込む関数
  const fetchTaskData = async () => {
    const postData = collection(db, 'tasks');
    onSnapshot(postData, (snapshot) => {
      const taskData = [];
      snapshot.forEach((doc) => {
        taskData.push({ id: doc.id, ...doc.data() });
      });
      setData(taskData);
    });
  };

  // コンポーネントが初期マウント時にFirestoreからデータを読み込む
  useEffect(() => {
    fetchTaskData();
  }, []);

  // タスクの削除
  const onDelete = async ({ id }) => {
    if (window.confirm('本当に削除しますか？')) {
      try {
        const taskRef = doc(db, 'tasks', id);
        await deleteDoc(taskRef);
        toast.success('タスクを削除しました');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // タイマーにセットするための選択したタスクを設定
  const getSelectedTasksData = () => {
    const selectedTasksData = [];

    checkedTasks.forEach((taskId) => {
      const selectedTask = data.find((task) => task.id === taskId);
      if (selectedTask) {
        selectedTasksData.push(selectedTask);
      }
    });
    setSelectedTasksData(selectedTasksData);
    navigate('/timer');
  };

  // 選択した利用者名に一致するデータのみを表示
  const filteredData = selectedPerson
    ? data.filter((task) => {
      // 利用者名のスペースを取り除いてから比較
      const cleanedSelectedPerson = selectedPerson.replace(/\s/g, ''); // スペースを取り除く
      const cleanedTaskPerson = task.person.replace(/\s/g, ''); // スペースを取り除く
      return cleanedTaskPerson === cleanedSelectedPerson;
    })
    : data;



  return (
    <div className="table">
      <section className="table-header">
        <h2 className="table-title">登録したタスク一覧</h2>
        <div className="person-dropdown">
          <select value={ selectedPerson } onChange={ (e) => setSelectedPerson(e.target.value) }>
            <option value="">利用者で検索する/全て</option>
            { personSelectOptions }
          </select>
        </div>
        <button onClick={ getSelectedTasksData } className='btn-main'>タイマーにセットする</button>
      </section>

      <section className="table-body">
        <table>
          <thead>
            <tr>
              <th style={ { textAlign: 'center' } }>No.</th>
              <th style={ { textAlign: 'center' } }>タスク名</th>
              <th style={ { textAlign: 'center' } }>利用者名</th>
              <th style={ { textAlign: 'center' } }>時間</th>
              <th style={ { textAlign: 'center' } }>マニュアル</th>
              <th style={ { textAlign: 'center' } }>アクション</th>
              <th style={ { textAlign: 'center' } }>セット</th>
              <th style={ { textAlign: 'center' } }>順番</th>
            </tr>
          </thead>
          <tbody>
            { filteredData.map((task, index) => {
              const order = checkedTasks.indexOf(task.id) + 1;

              return (
                <tr key={ task.id }>
                  <th scope="row">{ index + 1 }</th>
                  <td className="name-cell">{ task.name }</td>
                  <td className="person-cell">{ task.person } さん</td>
                  <td className="time-cell">{ task.minutes } min</td>
                  <td
                    className="memo-cell"
                    dangerouslySetInnerHTML={ { __html: task.memo.replace(/\n/g, '<br/>') } }
                  ></td>

                  <td className="action-cell">
                    <Link to={ `/update/${task.id}` }>
                      <button className="btn btn-edit">編集する</button>
                    </Link>
                    <button className="btn btn-delete" onClick={ () => onDelete({ id: task.id }) }>
                      削除する
                    </button>
                    <Link to={ `/view/${task.id}` }>
                      <button className="btn btn-view">詳細をみる</button>
                    </Link>
                  </td>
                  <td className="action-cell">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={ checkedTasks.includes(task.id) }
                      onChange={ () => toggleTaskCheckbox(task.id) }
                    />
                  </td>
                  <td className="order-cell">
                    <div className={ order > 0 ? 'show-order' : '' }>{ order > 0 ? order : null }</div>
                  </td>
                </tr>
              );
            }) }
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Home;