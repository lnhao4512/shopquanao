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
              <span className="ads-logo__mark" aria-hidden="true" />
              <span className="ads-logo__text">SHOP</span>
            </Link>

            <nav className="ads-nav" aria-label="Categories">
              <Link className="ads-navLink" to="/home">New & Hot</Link>
              {this.state.categories.map((c) => {
                const hasChildren = c.children && c.children.length > 0;

                if (hasChildren) {
                  const isHovered = this.state.hoverMenuId === c._id;

                  return (
                    <div 
                      key={c._id}
                      style={{ position: 'static', display: 'flex', alignItems: 'center', height: '100%' }}
                      onMouseEnter={() => this.handleMouseEnter(c._id)}
                      onMouseLeave={() => this.handleMouseLeave()}
                    >
                      <Link 
                        className="ads-navLink" 
                        to={`/product/category/${c._id}`}
                        style={{ background: isHovered ? '#f3f4f6' : '' }}
                      >
                        {c.name}
                      </Link>
                      
                      {isHovered && (
                        <div className="dropdown-mega">
                            <div className="dropdown-mega__inner">
                                <div className="dropdown-cols">
                                    {c.children.map(lvl2 => (
                                        <div key={lvl2._id} className="dropdown-col">
                                            <Link className="dropdown-title" to={`/product/category/${lvl2._id}`} onClick={() => this.setState({hoverMenuId: null})}>{lvl2.name}</Link>
                                            {lvl2.children && lvl2.children.length > 0 && (
                                                <ul className="dropdown-list">
                                                    {lvl2.children.map(lvl3 => (
                                                        <li key={lvl3._id} className="dropdown-item">
                                                            <Link className="dropdown-link" to={`/product/category/${lvl3._id}`} onClick={() => this.setState({hoverMenuId: null})}>{lvl3.name}</Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="dropdown-promo">
                                    <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=400" alt={`${c.name} Collection`} className="dropdown-promo__img" />
                                    <div className="dropdown-promo__text">
                                        Bộ sưu tập {c.name} <br/>Khám phá ngay &rarr;
                                    </div>
                                </div>
                            </div>
                        </div>
                      )}
                    </div>
                  );
                } 

                return (
                  <Link key={c._id} className="ads-navLink" to={`/product/category/${c._id}`}>
                    {c.name}
                  </Link>
                );
              })}
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

