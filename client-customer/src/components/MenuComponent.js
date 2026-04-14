import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tree: [],           // nested tree từ /categories/tree
            txtKeyword: '',
            openMenuId: null,   // ID của root menu đang hover/open
            hoverNam: false     // State cho menu cứng "Nam"
        };
    }

    render() {
        const { tree, openMenuId } = this.state;

        const rootItems = tree.map((root) => {
            const hasChildren = root.children && root.children.length > 0;
            const isOpen = openMenuId === root._id;

            return (
                <li
                    key={root._id}
                    className="nav-item"
                    onMouseEnter={() => this.setState({ openMenuId: root._id })}
                    onMouseLeave={() => this.setState({ openMenuId: null })}
                >
                    {hasChildren ? (
                        <span className="nav-link nav-link--parent">
                            {root.name}
                            <svg className="nav-chevron" viewBox="0 0 10 6" fill="none">
                                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </span>
                    ) : (
                        <Link className="nav-link" to={`/product/category/${root._id}`}>{root.name}</Link>
                    )}

                    {hasChildren && isOpen && (
                        <div className="dropdown-mega">
                            <div className="dropdown-mega__inner">
                                <div className="dropdown-cols">
                                    {root.children.map((lvl2) => {
                                        const hasGrandChildren = lvl2.children && lvl2.children.length > 0;
                                        return (
                                            <div key={lvl2._id} className="dropdown-col">
                                                <Link
                                                    className="dropdown-title"
                                                    to={`/product/category/${lvl2._id}`}
                                                >
                                                    {lvl2.name}
                                                </Link>
                                                {hasGrandChildren && (
                                                    <ul className="dropdown-list">
                                                        {lvl2.children.map((lvl3) => (
                                                            <li key={lvl3._id} className="dropdown-item">
                                                                <Link
                                                                    className="dropdown-link"
                                                                    to={`/product/category/${lvl3._id}`}
                                                                >
                                                                    {lvl3.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="dropdown-promo">
                                    <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400" alt="Promo collection" className="dropdown-promo__img" />
                                    <div className="dropdown-promo__text">
                                        Bộ sưu tập mới! <br/>Khám phá ngay &rarr;
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </li>
            );
        });

        return (
            <header className="site-header">
                <nav className="nav-bar">
                    {/* Logo */}
                    <Link to="/" className="nav-logo">
                        <span className="nav-logo__icon">👗</span>
                        <span className="nav-logo__text">FashionStore</span>
                    </Link>

                    {/* Menu chính */}
                    <ul className="nav-list">
                        <li className="nav-item">
                            <Link className="nav-link" style={{ textAlign: 'center', lineHeight: 1.2, fontSize: '11px', fontWeight: 800, padding: '0 8px' }} to="/product/search/new-and-hot">
                                NEW<br/>&<br/>HOT
                            </Link>
                        </li>

                        <li 
                            className="nav-item"
                            onMouseEnter={() => this.setState({ hoverNam: true })}
                            onMouseLeave={() => this.setState({ hoverNam: false })}
                        >
                            <span 
                                className="nav-link nav-link--parent"
                                style={{ 
                                    background: this.state.hoverNam ? '#f3f4f6' : 'transparent', 
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                    margin: 'auto 0'
                                }}
                            >
                                NAM
                            </span>
                            
                            {this.state.hoverNam && (
                                <div className="dropdown-mega">
                                    <div className="dropdown-mega__inner">
                                        <div className="dropdown-cols">
                                            <div className="dropdown-col">
                                                <span className="dropdown-title">ÁO</span>
                                                <ul className="dropdown-list">
                                                    <li className="dropdown-item"><Link className="dropdown-link" to="/product/search/Áo thun nam">Áo thun</Link></li>
                                                    <li className="dropdown-item"><Link className="dropdown-link" to="/product/search/Áo sơ mi nam">Áo sơ mi</Link></li>
                                                    <li className="dropdown-item"><Link className="dropdown-link" to="/product/search/Áo hoodie nam">Áo hoodie</Link></li>
                                                </ul>
                                            </div>
                                            <div className="dropdown-col">
                                                <span className="dropdown-title">QUẦN</span>
                                                <ul className="dropdown-list">
                                                    <li className="dropdown-item"><Link className="dropdown-link" to="/product/search/Quần bó nam">Quần bó</Link></li>
                                                    <li className="dropdown-item"><Link className="dropdown-link" to="/product/search/Quần dài nam">Quần dài</Link></li>
                                                    <li className="dropdown-item"><Link className="dropdown-link" to="/product/search/Quần short nam">Quần short</Link></li>
                                                </ul>
                                            </div>
                                            <div className="dropdown-col">
                                                <span className="dropdown-title">PHỤ KIỆN</span>
                                                <ul className="dropdown-list">
                                                    <li className="dropdown-item"><Link className="dropdown-link" to="/product/search/Nón nam">Nón</Link></li>
                                                    <li className="dropdown-item"><Link className="dropdown-link" to="/product/search/Túi nam">Túi</Link></li>
                                                    <li className="dropdown-item"><Link className="dropdown-link" to="/product/search/Thắt lưng nam">Thắt lưng</Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="dropdown-promo">
                                            <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=400" alt="Mens Collection" className="dropdown-promo__img" />
                                            <div className="dropdown-promo__text">
                                                Bộ sưu tập Nam <br/>Khám phá ngay &rarr;
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>

                        <li className="nav-item"><Link className="nav-link" to="/product/search/Nữ">NỮ</Link></li>
                        <li className="nav-item">
                            <Link className="nav-link" style={{ textAlign: 'center', lineHeight: 1.2 }} to="/product/search/Trẻ Em">
                                TRẺ<br/>EM
                            </Link>
                        </li>
                        <li className="nav-item"><Link className="nav-link" to="/product/search/Unisex">UNISEX</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/product/search/Sale">SALE</Link></li>
                        <li className="nav-item">
                            <Link className="nav-link" style={{ textAlign: 'center', lineHeight: 1.2 }} to="/product/search/New Arrivals">
                                NEW<br/>ARRIVALS
                            </Link>
                        </li>
                        <li className="nav-item"><Link className="nav-link" to="/product/search/Áo">ÁO</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/product/search/Quần">QUẦN</Link></li>
                    </ul>

                    {/* Search bar */}
                    <form className="nav-search" onSubmit={(e) => { e.preventDefault(); this.props.navigate('/product/search/' + this.state.txtKeyword); }}>
                        <input
                            type="search"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="nav-search__input"
                            value={this.state.txtKeyword}
                            onChange={(e) => this.setState({ txtKeyword: e.target.value })}
                        />
                        <button type="submit" className="nav-search__btn">
                            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </form>
                </nav>
            </header>
        );
    }

    componentDidMount() {
        this.apiGetCategoryTree();
    }

    apiGetCategoryTree() {
        axios.get('/api/customer/categories/tree').then((res) => {
            this.setState({ tree: res.data });
        }).catch((err) => {
            console.error('Get category tree failed:', err.message);
            // Fallback: dùng flat list
            axios.get('/api/customer/categories').then((res) => {
                // Tự build tree từ flat list
                const flat = res.data;
                const buildTree = (list, parentId = null) =>
                    list
                        .filter((c) => String(c.parentId || null) === String(parentId))
                        .map((c) => ({ ...c, children: buildTree(list, c._id) }));
                this.setState({ tree: buildTree(flat) });
            }).catch(() => this.setState({ tree: [] }));
        });
    }
}

export default withRouter(Menu);
