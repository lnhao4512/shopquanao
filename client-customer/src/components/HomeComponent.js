import axios from 'axios';
import React, { Component } from 'react';
import ProductCard from './ui/ProductCard';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newprods: [],
            hotprods: [],
            banner: null
        };
    }
    render() {
        const banner = this.state.banner;
        const imgSrc = banner?.image 
            ? (banner.image.startsWith('http') || banner.image.startsWith('data:') 
                ? banner.image : 'data:image/jpg;base64,' + banner.image)
            : null;

        return (
            <div className="ads-container ads-home">
                <section className="ads-hero">
                    <div className="ads-hero__content">
                        <div className="ads-hero__kicker">{banner?.kicker || 'NEW SEASON'}</div>
                        <h1 className="ads-hero__title">{banner?.title || 'Move fast. Look sharp.'}</h1>
                        <p className="ads-hero__desc">
                            {banner?.desc || 'Discover new drops and best-sellers. Built for everyday comfort.'}
                        </p>
                        <div className="ads-hero__actions">
                            <a className="ads-btn ads-btn--primary" href={banner?.primaryBtnLink || '#new'}>{banner?.primaryBtnText || 'Shop new'}</a>
                            <a className="ads-btn ads-btn--ghost" href={banner?.secondaryBtnLink || '#hot'}>{banner?.secondaryBtnText || 'Shop hot'}</a>
                        </div>
                    </div>
                    <div className="ads-hero__art" aria-hidden="true" style={imgSrc ? { backgroundImage: `url(${imgSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                        {!imgSrc && <div className="ads-stripes" />}
                    </div>
                </section>

                <section id="new" className="ads-section">
                    <div className="ads-section__head">
                        <h2 className="ads-section__title">New products</h2>
                        <span className="ads-section__sub">Fresh arrivals picked for you</span>
                    </div>
                    <div className="ads-grid">
                        {this.state.newprods.map((p) => <ProductCard key={p._id} product={p} />)}
                    </div>
                </section>

                <section className="ads-mid-banner">
                    <div className="ads-mid-banner__bg">
                        <img src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/if_w_gt_1920,w_1920/enUS/Images/originals-fw23-tfl-gl-mh-d_tcm221-1033783.jpg" alt="Adidas Vip Pro Banner" />
                    </div>
                    <div className="ads-mid-banner__content">
                        <div className="ads-mid-banner__kicker">ORIGINALS EXCLUSIVE</div>
                        <h2 className="ads-mid-banner__title">IMPOSSIBLE IS NOTHING</h2>
                        <p className="ads-mid-banner__desc">Experience the pinnacle of style and performance. Step into the future.</p>
                        <div className="ads-mid-banner__actions">
                            <a className="ads-btn ads-btn--primary" style={{ background: '#fff', color: '#111', padding: '14px 28px', fontSize: 13 }} href="#hot">EXPLORE COLLECTION</a>
                        </div>
                    </div>
                </section>

                {this.state.hotprods.length > 0 ? (
                    <section id="hot" className="ads-section">
                        <div className="ads-section__head">
                            <h2 className="ads-section__title">Hot products</h2>
                            <span className="ads-section__sub">Trending right now</span>
                        </div>
                        <div className="ads-grid">
                            {this.state.hotprods.map((p) => <ProductCard key={p._id} product={p} />)}
                        </div>
                    </section>
                ) : null}
            </div>
        );
    }
    componentDidMount() {
        this.apiGetNewProducts();
        this.apiGetHotProducts();
        this.apiGetBanners();
    }
    // apis
    apiGetNewProducts() {
        axios.get('/api/customer/products/new').then((res) => {
            const result = res.data;
            this.setState({ newprods: result });
        }).catch((err) => {
            console.error('Get new products failed:', err.message);
            this.setState({ newprods: [] });
        });
    }
    apiGetHotProducts() {
        axios.get('/api/customer/products/hot').then((res) => {
            const result = res.data;
            this.setState({ hotprods: result });
        }).catch((err) => {
            console.error('Get hot products failed:', err.message);
            this.setState({ hotprods: [] });
        });
    }
    apiGetBanners() {
        axios.get('/api/customer/banners').then((res) => {
            const result = res.data;
            if (result && result.length > 0) {
                // Find first active banner
                const activeBanner = result.find(b => b.active);
                if (activeBanner) {
                    this.setState({ banner: activeBanner });
                }
            }
        }).catch((err) => {
            console.error('Get banners failed:', err.message);
        });
    }
}
export default Home;
