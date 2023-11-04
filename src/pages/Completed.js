import React from 'react';
import "./Completed.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Completed = () => {
  const navigate = useNavigate();

  const backToHome = () => {
    navigate('/');
    toast.dismiss();
    toast.success("新しいタスクをセットしましょう！");
  };

  return (
    <section className='completed'>
      <div className="completed-title">
        <h1>全てのタスクが完了しました！</h1><br />
        <h1>お疲れ様でした！</h1>
      </div>
      <div className="completed-btn">
        <button onClick={ backToHome }>ホームに戻る</button>
      </div>
    </section>
  );
};

export default Completed;
