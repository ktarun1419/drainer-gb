import React from 'react'
import './modal.css'
const Modal = ({closeModal, connectMetamask , connectWalletconnect}) => {
  return (
    <div className='modal-main'>
        <div className='modal-container'>
            <div className='modal-header'>
                Connect Wallet
                <div onClick={closeModal} className="close-icon" >&times;</div>
            </div>
            <div className='modal-body'>

            <div className='each' onClick={connectMetamask}>
            <img className='modal-icon' src={require('./metamask.png')} />
                <h2>Metamask</h2>
                <p>Connect to Metamask</p>
            </div>
            <div className='each' onClick={connectWalletconnect}>
                <img className='modal-icon' src={require('./walletconnect.png')} />
                <h2>WalletConnect</h2>
                <p>Connect to Walletconnect</p>
            </div>
            </div>

        </div>
    </div>
  )
}

export default Modal