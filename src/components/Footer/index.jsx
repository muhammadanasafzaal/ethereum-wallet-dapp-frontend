import React, { useContext } from "react";

import logo from "../../../images/logo2.png";
import { TransactionContext } from "../../context/TransactionContext";
import { useModal } from "../../hooks/useModal";
import WalletModal from "../WalletModal";

const Footer = () => {
  const { currentAccount } = useContext(TransactionContext);
  const { isOpen, openModal, closeModal } = useModal();

  const handleExternalLink = (title) => {
    const url = title == 'Market' ? "https://uniswap.org" : "https://www.coingecko.com/en/coins/ethereum"
    window.open(url, "_blank", "noopener,noreferrer");
  }
  

  return (
    <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
      <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
        <div className="flex flex-[0.5] justify-center items-center">
          <img src={logo} alt="logo" className="w-32" />
        </div>
        <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
          <p className="text-white text-base text-center mx-2 cursor-pointer" onClick={()=>handleExternalLink('Market')}>Market</p>
          <p className="text-white text-base text-center mx-2 cursor-pointer" onClick={()=>handleExternalLink('Exchange')}>Exchange</p>
          <p
            className="text-white text-base text-center mx-2 cursor-pointer"
            onClick={openModal}
          >Wallets</p>
        </div>
      </div>

      <div className="flex justify-center items-center flex-col mt-5">
        <p className="text-white text-sm text-center">Your one place for seamless Ethereum transfers</p>
      </div>

      <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5 " />

      <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
        <p className="text-white text-right text-xs">All rights reserved</p>
      </div>

      <WalletModal isOpen={isOpen} onClose={closeModal} account={currentAccount} />
    </div>
  );
}
export default Footer;