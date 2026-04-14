import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
    static contextType = MyContext;
    constructor(props) {
        super(props);
        this.state = {
            product: null,
            selectedSize: null,   // size đang được chọn (object {name,stock,price})
            txtQuantity: 1
        };
    }

    // ── Tính giá hiển thị theo size đang chọn ───────────────────────────────
    getDisplayPrice() {
        const { product, selectedSize } = this.state;
        if (!product) return 0;
        if (selectedSize && selectedSize.price) return selectedSize.price;
        return product.price;
    }

    // ── Render size picker button group ─────────────────────────────────────
    renderSizePicker() {
        const { product, selectedSize } = this.state;
        if (!product) return null;
        const variants = Array.isArray(product.variants) ? product.variants : (Array.isArray(product.sizes) ? product.sizes : []);
        if (variants.length === 0) return null;   // sản phẩm không có size

        return (
            <div className="size-picker__wrap">
                <div className="size-picker__label">
                    Chọn size
                    {selectedSize && (
                        <span className="size-picker__chosen">
                            &nbsp;— <strong>{selectedSize.size || selectedSize.name}</strong>
                            {selectedSize.price
                                ? ` · ${Number(selectedSize.price).toLocaleString('vi-VN')} ₫`
                                : ''}
                            &nbsp;·&nbsp;Còn <strong>{selectedSize.stock}</strong> sản phẩm
                        </span>
                    )}
                </div>
                <div className="size-picker__group">
                    {variants.map((s) => {
                        const sName = s.size || s.name;
                        const isOut   = s.stock === 0;
                        const isActive = selectedSize && (selectedSize.size === sName || selectedSize.name === sName);
                        return (
                            <button
                                key={sName}
                                type="button"
                                disabled={isOut}
                                onClick={() => this.setState({ selectedSize: s })}
                                className={[
                                    'size-btn',
                                    isActive ? 'size-btn--active' : '',
                                    isOut    ? 'size-btn--out'    : ''
                                ].join(' ')}
                                title={isOut ? 'Hết hàng' : `Còn ${s.stock} sản phẩm`}
                            >
                                {sName}
                                {isOut && <span className="size-btn__out-tag">Hết</span>}
                            </button>
                        );
                    })}
                </div>
                <div className="size-guide">
                    <span className="size-guide__dot size-guide__dot--in"></span> Còn hàng &nbsp;
                    <span className="size-guide__dot size-guide__dot--out"></span> Hết hàng
                </div>
            </div>
        );
    }

    render() {
        const prod = this.state.product;
        if (!prod) return <div />;

        const imgSrc = prod.image
            ? (prod.image.startsWith('http') || prod.image.startsWith('data:')
                ? prod.image
                : 'data:image/jpg;base64,' + prod.image)
            : '';
        const displayPrice = this.getDisplayPrice();
        const variants = Array.isArray(prod.variants) ? prod.variants : (Array.isArray(prod.sizes) ? prod.sizes : []);
        const hasSizes = variants.length > 0;
        const totalStock = prod.totalStock !== undefined ? prod.totalStock : (hasSizes
            ? variants.reduce((sum, s) => sum + (s.stock || 0), 0)
            : null);

        return (
            <div className="ads-container ads-pdp">
                <div className="ads-pdp__grid">
                    {/* Ảnh */}
                    <div className="ads-pdp__media">
                        <img className="ads-pdp__img" src={imgSrc} alt={prod.name || 'Product'} />
                    </div>

                    {/* Info */}
                    <div className="ads-pdp__info">
                        <div className="ads-pdp__cat">{prod.category && prod.category.name}</div>
                        <h2 className="ads-pdp__name">{prod.name}</h2>

                        {/* Giá (thay đổi theo size được chọn) */}
                        <div className="ads-pdp__price">
                            {Number.isFinite(Number(displayPrice))
                                ? Number(displayPrice).toLocaleString('vi-VN') + ' ₫'
                                : displayPrice}
                            {this.state.selectedSize && this.state.selectedSize.price &&
                                this.state.selectedSize.price !== prod.price && (
                                <span className="pdp-price__base">
                                    &nbsp;
                                    <span style={{ fontSize: 14, color: '#999', textDecoration: 'line-through', fontWeight: 400 }}>
                                        {Number(prod.price).toLocaleString('vi-VN')} ₫
                                    </span>
                                </span>
                            )}
                        </div>

                        {/* Stock tổng */}
                        {totalStock !== null && (
                            <div className="pdp-stock">
                                {totalStock > 0
                                    ? <><span className="pdp-stock__dot pdp-stock__dot--in" /> Còn hàng ({totalStock} sản phẩm)</>
                                    : <><span className="pdp-stock__dot pdp-stock__dot--out" /> Hết hàng</>}
                            </div>
                        )}

                        {/* SIZE PICKER */}
                        {this.renderSizePicker()}

                        {/* Form add to cart */}
                        <form className="ads-pdp__form" onSubmit={(e) => this.btnAdd2CartClick(e)}>
                            <label className="ads-field">
                                <span className="ads-field__label">Số lượng</span>
                                <input
                                    className="ads-field__input"
                                    type="number" min="1" max="99"
                                    value={this.state.txtQuantity}
                                    onChange={(e) => this.setState({ txtQuantity: e.target.value })}
                                />
                            </label>
                            <button
                                className="ads-btn ads-btn--primary ads-btn--wide"
                                type="submit"
                                disabled={totalStock === 0}
                            >
                                {totalStock === 0 ? '⚠ Hết hàng' : '🛒 Thêm vào giỏ'}
                            </button>
                        </form>

                        {/* Meta */}
                        <div className="ads-pdp__meta">
                            <div><b>ID</b>: {prod._id}</div>
                            <div><b>Danh mục</b>: {prod.category && prod.category.name}</div>
                            {hasSizes && (
                                <div>
                                    <b>Sizes:</b>{' '}
                                    {variants.map(s => (
                                        <span key={s.size || s.name} style={{
                                            marginRight: 4, padding: '1px 6px',
                                            background: s.stock > 0 ? '#dcfce7' : '#fee2e2',
                                            color: s.stock > 0 ? '#166534' : '#991b1b',
                                            borderRadius: 4, fontSize: 12, fontWeight: 600
                                        }}>
                                            {s.size || s.name} ({s.stock})
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const params = this.props.params;
        this.apiGetProduct(params.id);
    }

    apiGetProduct(id) {
        axios.get('/api/customer/products/' + id).then((res) => {
            this.setState({ product: res.data, selectedSize: null });
        }).catch(() => this.setState({ product: null }));
    }

    btnAdd2CartClick(e) {
        e.preventDefault();
        const { product, selectedSize, txtQuantity } = this.state;
        const quantity = parseInt(txtQuantity);
        if (!quantity || quantity < 1) {
            alert('Vui lòng nhập số lượng hợp lệ');
            return;
        }

        // Validate: nếu sản phẩm có variants → phải chọn size
        const variants = Array.isArray(product.variants) ? product.variants : (Array.isArray(product.sizes) ? product.sizes : []);
        const hasSizes = variants.length > 0;
        if (hasSizes && !selectedSize) {
            alert('⚠ Vui lòng chọn size trước khi thêm vào giỏ hàng!');
            return;
        }
        if (hasSizes && selectedSize && selectedSize.stock === 0) {
            alert('⚠ Size này đã hết hàng!');
            return;
        }
        if (hasSizes && selectedSize && quantity > selectedSize.stock) {
            alert(`⚠ Số lượng vượt quá tồn kho! Chỉ còn ${selectedSize.stock} sản phẩm.`);
            return;
        }

        const mycart = [...this.context.mycart];
        const sizeName = selectedSize ? (selectedSize.size || selectedSize.name) : '';
        // Cart key = productId + size (khác size = khác item)
        const cartKey = product._id + '_' + sizeName;
        const index = mycart.findIndex(x => x.cartKey === cartKey);

        const cartItem = {
            cartKey,
            product,
            quantity,
            size: sizeName,
            // Lưu giá thực tế khi add (có thể override theo size)
            unitPrice: this.getDisplayPrice()
        };

        if (index === -1) {
            mycart.push(cartItem);
        } else {
            mycart[index].quantity += quantity;
        }

        // Nếu đã đăng nhập, gọi API lưu Cart lên MongoDB
        if (this.context.customer) {
            const body = {
                userId: this.context.customer._id,
                productId: product._id,
                size: sizeName,
                quantity: quantity,
                price: this.getDisplayPrice()
            };
            const config = { headers: { 'x-access-token': this.context.token } };
            axios.post('/api/customer/cart/add', body, config).then(() => {
                this.context.setMycart(mycart);
                this.props.navigate('/mycart');
            }).catch(err => {
                console.error("Cart API err", err);
                // Fallback to local cart
                this.context.setMycart(mycart);
                this.props.navigate('/mycart');
            });
        } else {
            this.context.setMycart(mycart);
            this.props.navigate('/mycart');
        }
    }
}

export default withRouter(ProductDetail);
