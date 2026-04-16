import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../../contexts/MyContext';
import withRouter from '../../utils/withRouter';

class Header extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      keyword: '',
      hoverMenuId: null
    };
    this.leaveTimeout = null;
  }

  handleMouseEnter(id) {
    if (this.leaveTimeout) {
      clearTimeout(this.leaveTimeout);
    }
    this.setState({ hoverMenuId: id });
  }

  handleMouseLeave() {
    this.leaveTimeout = setTimeout(() => {
      this.setState({ hoverMenuId: null });
    }, 250); // Delay 250ms để kéo chuột xuống dễ dàng
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  render() {
    const { token, customer, mycart } = this.context;
    const cartCount = mycart ? mycart.length : 0;

    return (
      <header className="ads-header">
        <div className="ads-header__top">
          <div className="ads-container ads-header__topInner">
            <div className="ads-header__topLeft">
              <span className="ads-topNote">FREE SHIPPING over 999k</span>
            </div>
            <div className="ads-header__topRight">
              {token ? (
                <>
                  <span className="ads-topLink">Hi, <b>{customer && customer.name}</b></span>
                  <span className="ads-dot">·</span>
                  <Link className="ads-topLink" to="/myorders">Orders</Link>
                  <span className="ads-dot">·</span>
                  <Link className="ads-topLink" to="/myprofile">Profile</Link>
                  <span className="ads-dot">·</span>
                  <button className="ads-topBtn" type="button" onClick={() => this.logout()}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link className="ads-topLink" to="/login">Đăng nhập</Link>
                  <span className="ads-dot">·</span>
                  <Link className="ads-topLink" to="/signup">Đăng ký</Link>
                  <span className="ads-dot">·</span>
                  <Link className="ads-topLink" to="/active">Kích hoạt</Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="ads-header__main">
          <div className="ads-container ads-header__mainInner">
            <Link to="/home" className="ads-logo" aria-label="Home">
              <span className="ads-logo__icon" aria-hidden="true">🍃</span>
            </Link>

            <nav className="ads-nav" aria-label="Categories">
              <a className="ads-navLink" href="/home#story">Thương Hiệu</a>
              
              {/* Dropdown for Sản Phẩm */}
              <div 
                style={{ position: 'static', display: 'flex', alignItems: 'center', height: '100%', cursor: 'pointer' }}
                onMouseEnter={() => this.handleMouseEnter('prods_dropdown')}
                onMouseLeave={() => this.handleMouseLeave()}
              >
                <Link className="ads-navLink" to="/home#new">Sản Phẩm</Link>
                {this.state.hoverMenuId === 'prods_dropdown' && (
                  <div className="dropdown-mega">
                    <div className="dropdown-mega__inner">
                      <div className="dropdown-cols">
                        {this.state.categories.slice(0, 4).map(c => (
                          <div key={c._id} className="dropdown-col">
                            <Link className="dropdown-title" to={`/product/category/${c._id}`} onClick={() => this.setState({hoverMenuId: null})}>{c.name}</Link>
                            {c.children && c.children.length > 0 && (
                              <ul className="dropdown-list">
                                {c.children.slice(0, 5).map(sub => (
                                  <li key={sub._id} className="dropdown-item">
                                    <Link className="dropdown-link" to={`/product/category/${sub._id}`} onClick={() => this.setState({hoverMenuId: null})}>{sub.name}</Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <a className="ads-navLink" href="/home#philosophy">Triết Lý</a>
            </nav>

            <div className="ads-actions">
              <form className="ads-search" onSubmit={(e) => this.onSearch(e)}>
                <input
                  className="ads-search__input"
                  type="search"
                  value={this.state.keyword}
                  placeholder="Search products"
                  onChange={(e) => this.setState({ keyword: e.target.value })}
                />
                <button className="ads-search__btn" type="submit">Search</button>
              </form>

              <Link className="ads-cart" to="/mycart" aria-label="Cart">
                <span className="ads-cart__icon" aria-hidden="true">🛒</span>
                <span className="ads-cart__label">Cart</span>
                <span className="ads-cart__badge">{cartCount}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  logout() {
    this.context.setToken('');
    this.context.setCustomer(null);
    this.context.setMycart([]);
    this.props.navigate('/home');
  }

  onSearch(e) {
    e.preventDefault();
    const kw = (this.state.keyword || '').trim();
    if (!kw) return;
    this.props.navigate(`/product/search/${encodeURIComponent(kw)}`);
  }

  apiGetCategories() {
    axios.get('/api/customer/categories/tree').then((res) => {
        this.setState({ categories: res.data });
    }).catch((err) => {
        console.error('Get category tree failed:', err.message);
        // Fallback to auto-building tree if /tree endpoint not found
        axios.get('/api/customer/categories').then((res) => {
            const flat = res.data;
            const buildTree = (list, parentId = null) =>
                list
                    .filter((c) => String(c.parentId || null) === String(parentId))
                    .map((c) => ({ ...c, children: buildTree(list, c._id) }));
            this.setState({ categories: buildTree(flat) });
        }).catch(() => this.setState({ categories: [] }));
    });
  }
}

export default withRouter(Header);

