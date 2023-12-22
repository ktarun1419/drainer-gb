import React from "react";
import "./design.css";
import SVG from "react-inlinesvg";
import { Bellicon, LogoSvg, graphSVG } from "./constant";
const Design = ({ connectWallet }) => {
  return (
    <div className="main-container">
      <div className="navbar">
        <div>
          <SVG src={LogoSvg} />
        </div>
        <div className="routes">
          <div>Our Story</div>
          <div>Develop</div>
          <div>Ecosystem</div>
          <div>Resources</div>
          <div>Bridge</div>
          <button className="metamask-button" onClick={connectWallet}>Connect Wallet</button>
        </div>
        <button className="metamask-button show" onClick={connectWallet}>Connect Wallet</button>
      </div>
      <div className="main-body">
        <div className="svg-container">
          <SVG src={graphSVG} />
        </div>
        <div className="text-container">
          <div className="heading-1">SCROLL ORIGIN AIRDROP</div>
          <div className="info-container">
            <div className="box">
              <div className="heading-2">Total AIRDROP</div>
              <div className="answer">$30000000</div>
            </div>
            <div className="box">
              <div className="heading-2">AIRDROPS STARTED ON</div>
              <div className="answer">Dec 25,2023</div>
            </div>
          </div>
          <button className="metamask-button" onClick={connectWallet}>Connect Wallet</button>
        </div>
      </div>
      <div className="email-container">
        <div className="email-each">
            <SVG src={Bellicon} />
            <div>Stay up-to-date on the latest Scroll developer news</div>
        </div>
      </div>
      <div className="footer">
        <div className="footer-each">
            <SVG src={LogoSvg} />
        </div>
        <div className="footer-each">
            <div>Terms of Service</div>
            <div>
                Privacy Policy
            </div>
        </div>
        <div className="footer-each">
        © Version 5.0.60 Scroll Ltd 2023
        </div>
      </div>
    </div>
  );
};

export default Design;
