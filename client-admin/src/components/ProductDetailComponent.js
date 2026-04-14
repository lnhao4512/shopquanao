import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

class ProductDetail extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: '',
      cmbCategory: '',
      imgProduct: '',
      imgProduct: '',
      imgFile: null,
      variants: ALL_SIZES.map(n => ({ size: n, stock: 0, price: '', enabled: false })),
      totalStock: 0,
      saving: false
    };
  }

  buildVariantsPayload() {
    return this.state.variants
      .filter(s => s.enabled)
      .map(s => ({
        size: s.size,
        stock: parseInt(s.stock) || 0,
        price: s.price !== '' && s.price !== null ? parseInt(s.price) : null
      }));
  }

  toggleVariant(idx, checked) {
    const variants = [...this.state.variants];
    variants[idx] = { ...variants[idx], enabled: checked, stock: checked ? (variants[idx].stock || 0) : 0 };
    
    const totalStock = variants.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0);
    this.setState({ variants, totalStock });
  }

  updateVariantField(idx, field, value) {
    const variants = [...this.state.variants];
    variants[idx] = { ...variants[idx], [field]: value };

    const totalStock = variants.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0);
    this.setState({ variants, totalStock });
  }

  render() {
    const { txtID, txtName, txtPrice, cmbCategory, imgProduct, variants, totalStock, saving } = this.state;
    const { categories } = this.state;
    const isEdit = !!txtID;

    const catOptions = categories.map(c => (
      <option key={c._id} value={c._id}
        selected={cmbCategory === c._id}>{c.name}</option>
    ));

    return (
      <div className="detail-panel" style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
        {/* Title */}
        <div className="detail-panel__title">
          {isEdit ? '✏️ Sửa sản phẩm' : '✚ Thêm sản phẩm mới'}
        </div>

        {/* Image preview */}
        <div className="img-preview" onClick={() => document.getElementById('fileInput').click()}
          style={{ cursor: 'pointer', marginBottom: 16 }}>
          {imgProduct
            ? <img src={imgProduct} alt="preview" />
            : <div className="img-preview__placeholder">
                <div style={{ fontSize: 32, marginBottom: 6 }}>📷</div>
                <div>Click để chọn ảnh</div>
                <div style={{ fontSize: 11 }}>JPG, PNG, GIF</div>
              </div>}
          {imgProduct && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity .2s', color: '#fff', fontSize: 14
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0}
            >📷 Đổi ảnh</div>
          )}
        </div>
        <input id="fileInput" type="file" accept="image/*" style={{ display: 'none' }}
          onChange={(e) => this.previewImage(e)} />

        {/* Form */}
        {isEdit && (
          <div className="form-group">
            <label className="form-label">ID</label>
            <input className="form-input" value={txtID} readOnly />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Tên sản phẩm *</label>
          <input className="form-input" type="text" placeholder="VD: Áo Thun Nam Basic"
            value={txtName} onChange={(e) => this.setState({ txtName: e.target.value })} />
        </div>

        <div className="form-group">
          <label className="form-label">Giá cơ bản (₫) *</label>
          <input className="form-input" type="number" min="0" placeholder="VD: 299000"
            value={txtPrice} onChange={(e) => this.setState({ txtPrice: e.target.value })} />
          <span className="form-hint">Giá mặc định khi size không có giá riêng</span>
        </div>

        <div className="form-group">
          <label className="form-label">Danh mục *</label>
          <select className="form-select" value={cmbCategory}
            onChange={(e) => this.setState({ cmbCategory: e.target.value })}>
            <option value="">— Chọn danh mục (leaf) —</option>
            {catOptions}
          </select>
          <span className="form-hint">Chỉ hiển thị danh mục cấp cuối</span>
        </div>

        {/* Size manager */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <label className="form-label" style={{ margin: 0 }}>📏 Quản lý Size & Tồn kho</label>
            <span className="badge badge-purple" style={{ fontSize: 12 }}>Tổng tồn: {totalStock}</span>
          </div>
          
          <div className="size-manager">
            <table>
              <thead>
                <tr>
                  <th>Size</th>
                  <th style={{ textAlign: 'center' }}>Bật</th>
                  <th style={{ textAlign: 'right' }}>Tồn kho</th>
                  <th style={{ textAlign: 'right' }}>Giá riêng</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((s, idx) => (
                  <tr key={s.size}>
                    <td>
                      <span className={`size-badge ${s.enabled ? 'size-badge--active' : ''}`}
                            style={s.enabled && s.stock === 0 ? { border: '1px solid var(--c-red)', color: 'var(--c-red)', background: 'var(--c-red-bg)' } : {}}>
                        {s.size}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input type="checkbox" checked={s.enabled}
                        onChange={(e) => this.toggleVariant(idx, e.target.checked)} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <input type="number" min="0" max="9999" value={s.stock}
                        disabled={!s.enabled}
                        placeholder="0"
                        onChange={(e) => this.updateVariantField(idx, 'stock', e.target.value)}
                        style={{ textAlign: 'right', borderColor: s.enabled && s.stock == 0 ? 'var(--c-red)' : undefined }} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <input type="number" min="0" value={s.price}
                        disabled={!s.enabled}
                        placeholder="Mặc định"
                        onChange={(e) => this.updateVariantField(idx, 'price', e.target.value)}
                        style={{ textAlign: 'right', width: 90 }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <span className="form-hint mt-1">💡 "Giá riêng" để trống = dùng giá cơ bản</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {!isEdit && (
            <button className="btn btn-primary" style={{ flex: 1 }} disabled={saving}
              onClick={() => this.btnAddClick()}>
              {saving ? '⏳ Đang lưu...' : '✚ Thêm mới'}
            </button>
          )}
          {isEdit && (
            <>
              <button className="btn btn-success" style={{ flex: 1 }} disabled={saving}
                onClick={() => this.btnUpdateClick()}>
                {saving ? '⏳...' : '💾 Lưu'}
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => this.btnDeleteClick()}>
                🗑 Xóa
              </button>
            </>
          )}
          <button className="btn btn-ghost btn-sm" onClick={() => this.reset()}>↺</button>
        </div>
      </div>
    );
  }

  componentDidMount() { this.apiGetCategories(); }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      if (!this.props.item) { this.reset(); return; }
      const item = this.props.item;
      const existingVariants = Array.isArray(item.variants) ? item.variants : [];
      let totalStock = 0;
      const mergedVariants = ALL_SIZES.map(n => {
        // Fallback backward compatibility with old `sizes` array just in case
        const oldSizes = Array.isArray(item.sizes) ? item.sizes : [];
        const found = existingVariants.find(s => s.size === n) || oldSizes.find(s => s.name === n);
        
        if (found) totalStock += (found.stock || 0);

        return found
          ? { size: n, stock: found.stock || 0, price: found.price || '', enabled: true }
          : { size: n, stock: 0, price: '', enabled: false };
      });
      const imgSrc = item.image
        ? (item.image.startsWith('http') || item.image.startsWith('data:')
          ? item.image : 'data:image/jpg;base64,' + item.image)
        : '';
      this.setState({
        txtID: item._id, txtName: item.name, txtPrice: item.price,
        cmbCategory: item.category?._id || '',
        imgProduct: imgSrc, variants: mergedVariants, totalStock
      });
    }
  }

  reset() {
    this.setState({
      txtID: '', txtName: '', txtPrice: '', cmbCategory: '', imgProduct: '',
      variants: ALL_SIZES.map(n => ({ size: n, stock: 0, price: '', enabled: false })),
      totalStock: 0
    });
  }

  previewImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => this.setState({ imgProduct: evt.target.result });
    reader.readAsDataURL(file);
  }

  validate() {
    const { txtName, txtPrice, cmbCategory, imgProduct } = this.state;
    if (!txtName.trim()) { alert('Vui lòng nhập tên sản phẩm'); return false; }
    if (!txtPrice || parseInt(txtPrice) <= 0) { alert('Vui lòng nhập giá hợp lệ'); return false; }
    if (!cmbCategory) { alert('Vui lòng chọn danh mục'); return false; }
    if (!imgProduct) { alert('Vui lòng chọn ảnh sản phẩm'); return false; }
    return true;
  }

  buildPayload() {
    const imgBase64 = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');
    return {
      name: this.state.txtName.trim(),
      price: parseInt(this.state.txtPrice),
      category: this.state.cmbCategory,
      image: imgBase64,
      variants: this.buildVariantsPayload()
    };
  }

  btnAddClick() {
    if (!this.validate()) return;
    this.setState({ saving: true });
    this.apiPostProduct(this.buildPayload());
  }
  btnUpdateClick() {
    if (!this.validate()) return;
    this.setState({ saving: true });
    this.apiPutProduct({ id: this.state.txtID, ...this.buildPayload() });
  }
  btnDeleteClick() {
    if (!window.confirm('Xóa sản phẩm này?')) return;
    this.apiDeleteProduct(this.state.txtID);
  }

  apiPostProduct(prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/products', prod, config)
      .then(() => { this.setState({ saving: false }); this.reset(); this.apiRefreshProducts(); })
      .catch((err) => { this.setState({ saving: false }); alert('❌ ' + (err.response?.data?.message || err.message)); });
  }
  apiPutProduct(prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/products', prod, config)
      .then(() => { this.setState({ saving: false }); this.apiRefreshProducts(); })
      .catch((err) => { this.setState({ saving: false }); alert('❌ ' + (err.response?.data?.message || err.message)); });
  }
  apiDeleteProduct(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/products/' + id, config)
      .then(() => { this.reset(); this.apiRefreshProducts(); })
      .catch((err) => alert('❌ ' + err.message));
  }
  apiRefreshProducts() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/products?page=' + this.props.curPage, config).then((res) => {
      const result = res.data;
      if (result.products.length !== 0) {
        this.props.updateProducts(result.products, result.noPages);
      } else {
        const prevPage = Math.max(1, this.props.curPage - 1);
        axios.get('/api/admin/products?page=' + prevPage, config).then((r) => {
          this.props.updateProducts(r.data.products, r.data.noPages);
        }).catch(() => this.props.updateProducts([], 0));
      }
    }).catch(() => this.props.updateProducts([], 0));
  }
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories/leaves', config).then((res) => {
      this.setState({ categories: res.data });
    }).catch(() => this.setState({ categories: [] }));
  }
}
export default ProductDetail;
