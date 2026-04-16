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
            <div className="eco-home">
                {/* HERO SECTION */}
                <section className="eco-hero ads-container">
                    <div className="eco-hero__content">
                        <div className="eco-hero__badge">{banner?.kicker || '✨ 100% Tự Nhiên & Bền Vững'}</div>
                        <h1 className="eco-hero__title">{banner?.title || 'Mộc-Thanh Khiết'}</h1>
                        <p className="eco-hero__desc">
                            {banner?.desc || 'Thời trang bền vững, thuần khiết từ thiên nhiên. Mang đến cho bạn những trang phục eco-friendly, thoải mái và đầy phong cách.'}
                        </p>
                        <div className="eco-hero__actions">
                            <a className="eco-btn eco-btn--black" href={banner?.primaryBtnLink || "#new"}>{banner?.primaryBtnText || 'Khám Phá Ngay'}</a>
                            <a className="eco-btn eco-btn--outline" href={banner?.secondaryBtnLink || "#story"}>{banner?.secondaryBtnText || 'Câu Chuyện Thương Hiệu'}</a>
                        </div>
                    </div>
                    <div className="eco-hero__art">
                        <img src={imgSrc || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200"} alt={banner?.title || "Sustainable Fashion"} />
                    </div>
                </section>

                {/* STORY HUB SECTION */}
                <section id="story" className="eco-story ads-container">
                    <h2 className="eco-section__title text-center">Câu Chuyện Của Chúng Tôi</h2>
                    <p className="eco-section__desc text-center">
                        Mộc ra đời từ khát vọng mang lại thời trang bền vững, thuần khiết từ thiên nhiên cho mọi người yêu môi trường.
                    </p>
                    <div className="eco-story__grid">
                        <div className="eco-feature">
                            <div className="eco-feature__icon">🍃</div>
                            <h3 className="eco-feature__title">100% Vải Hữu Cơ</h3>
                            <p className="eco-feature__desc">Sử dụng vải cotton hữu cơ, linen và các sợi tự nhiên thân thiện với làn da và môi trường.</p>
                        </div>
                        <div className="eco-feature">
                            <div className="eco-feature__icon">🤍</div>
                            <h3 className="eco-feature__title">May Đo Thủ Công</h3>
                            <p className="eco-feature__desc">Mỗi sản phẩm được thiết kế và may thủ công với sự tỉ mỉ từng đường kim mũi chỉ.</p>
                        </div>
                        <div className="eco-feature">
                            <div className="eco-feature__icon">✨</div>
                            <h3 className="eco-feature__title">Thời Trang Bền Vững</h3>
                            <p className="eco-feature__desc">Cam kết giảm thiểu rác thải và sử dụng quy trình sản xuất thân thiện với môi trường.</p>
                        </div>
                    </div>
                </section>

                {/* PHILOSOPHY SECTION */}
                <section className="eco-philosophy ads-container">
                    <div className="eco-philosophy__art">
                        <img src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000" alt="Eco Philosophy" />
                    </div>
                    <div className="eco-philosophy__content">
                        <h2 className="eco-section__title">Triết Lý Thương Hiệu</h2>
                        <div className="eco-philosophy__block">
                            <p><strong>MỘC</strong> - Đại diện cho sự giản dị, thuần khiết của thiên nhiên. Thời trang Mộc lấy cảm hứng từ vẻ đẹp tự nhiên, không cần phô trương.</p>
                        </div>
                        <div className="eco-philosophy__block">
                            <p><strong>ECO</strong> - Cam kết về thời trang bền vững và sạch. Từ nguyên liệu vải hữu cơ, quy trình sản xuất thủ công cho đến bao bì tái chế, tất cả đều thân thiện môi trường.</p>
                        </div>
                        <p className="eco-philosophy__note">
                            Mỗi trang phục là lời nhắn nhủ: Hãy chọn lựa thời trang có ý nghĩa, tôn trọng thiên nhiên và yêu thương bản thân qua từng món đồ bền vững.
                        </p>
                    </div>
                </section>

                {/* PRODUCTS SECTION */}
                <section id="new" className="ads-section ads-container">
                    <div className="ads-section__head">
                        <h2 className="ads-section__title">Sản Phẩm Tinh Túy</h2>
                        <span className="ads-section__sub">Khám phá bộ sưu tập Eco-friendly</span>
                    </div>
                    <div className="ads-grid">
                        {this.state.newprods.map((p) => <ProductCard key={p._id} product={p} />)}
                    </div>
                </section>

                <div className="text-center" style={{ marginTop: 40 }}>
                    <a className="eco-btn eco-btn--black" href="/products">Xem Tất Cả Sản Phẩm</a>
                </div>
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
