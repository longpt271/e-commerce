import React from 'react';

const MobileWarning = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6439ff',
        height: '100vh',
        color: 'white',
      }}
    >
      <h1>Bạn đang dùng thiết bị di động.</h1>
      <h2>
        Vui lòng dùng Laptop hoặc PC truy cập lại để đạt được trải nghiệm tốt
        nhất!
      </h2>
    </div>
  );
};

export default MobileWarning;
