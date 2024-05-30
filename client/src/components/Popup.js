import React from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '80%',
    maxWidth: '500px',
    backgroundColor: '#fff',
  },
};

Modal.setAppElement('#root');

const ConfirmModal = ({ isOpen, onRequestClose, onConfirm, message, showCancelButton }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Confirm Action"
    >
      <h2 style={{ marginBottom: '20px', color: '#333' }}>{message}</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {showCancelButton && (
          <button
            onClick={onRequestClose}
            style={{
              backgroundColor: '#fff',
              color: '#007BFF',
              border: '2px solid #007BFF',
              borderRadius: '5px',
              padding: '10px 20px',
              cursor: 'pointer',
              marginRight: '10px',
              transition: 'background-color 0.3s, color 0.3s',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#007BFF';
              e.target.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#fff';
              e.target.style.color = '#007BFF';
            }}
          >
            Cancel
          </button>
        )}
        <button
          onClick={onConfirm}
          style={{
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 20px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#007BFF')}
        >
          OK
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
