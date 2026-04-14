import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Footer extends Component {
  render() {
    return (
      <footer className="ads-footer">
        <div className="ads-container ads-footer__grid">
          <div>
            <div className="ads-footer__title">Customer</div>
            <Link className="ads-footer__link" to="/myorders">Track orders</Link>
            <Link className="ads-footer__link" to="/myprofile">Account</Link>
            <Link className="ads-footer__link" to="/mycart">Cart</Link>
          </div>
          <div>
            <div className="ads-footer__title">Products</div>
            <Link className="ads-footer__link" to="/home">New arrivals</Link>
            <Link className="ads-footer__link" to="/home">Hot picks</Link>
          </div>
          <div>
            <div className="ads-footer__title">Support</div>
            <a className="ads-footer__link" href="mailto:support@example.com">support@example.com</a>
            <span className="ads-footer__muted">Mon–Sun 9:00–21:00</span>
          </div>
          <div>
            <div className="ads-footer__title">About</div>
            <span className="ads-footer__muted">
              Demo storefront UI inspired by modern sportswear e-commerce patterns.
            </span>
          </div>
        </div>
        <div className="ads-footer__bottom">
          <div className="ads-container ads-footer__bottomInner">
            <span className="ads-footer__muted">© {new Date().getFullYear()} SHOP</span>
            <span className="ads-footer__muted">Privacy · Terms</span>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;

