import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { compressImage } from '../utils/ImageUtil';

class BannerDetail extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtKicker: '',
      txtTitle: '',
      txtDesc: '',
      imgBanner: '',
      txtPrimaryBtnText: '',
      txtPrimaryBtnLink: '',
      txtSecondaryBtnText: '',
      txtSecondaryBtnLink: '',
      chkActive: true,
      saving: false
    };
  }

  render() {
    const { txtID, txtKicker, txtTitle, txtDesc, imgBanner, txtPrimaryBtnText, txtPrimaryBtnLink, txtSecondaryBtnText, txtSecondaryBtnLink, chkActive, saving } = this.state;
    const isEdit = !!txtID;

    return (
      <div className="detail-panel">
        <div className="detail-panel__title">
          {isEdit ? '✏️ Edit Banner' : '✚ Add New Banner'}
        </div>

        {/* Image preview */}
        <div className="img-preview" onClick={() => document.getElementById('fileInput').click()}
          style={{ cursor: 'pointer', marginBottom: 16, height: '150px' }}>
          {imgBanner
            ? <img src={imgBanner} alt="preview" style={{ maxHeight: '100%', maxWidth: '100%' }} />
            : <div className="img-preview__placeholder">
                <div style={{ fontSize: 32, marginBottom: 6 }}>📷</div>
                <div>Click to choose banner image</div>
                <div style={{ fontSize: 11 }}>JPG, PNG, GIF</div>
              </div>}
          {imgBanner && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity .2s', color: '#fff', fontSize: 14
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0}
            >📷 Change image</div>
          )}
        </div>
        <input id="fileInput" type="file" accept="image/*" style={{ display: 'none' }}
          onChange={(e) => this.previewImage(e)} />

        <div className="form-group">
          <label className="form-label">Kicker (Small top text)</label>
          <input className="form-input" type="text" value={txtKicker} onChange={(e) => this.setState({ txtKicker: e.target.value })} placeholder="e.g. NEW SEASON" />
        </div>

        <div className="form-group">
          <label className="form-label">Title (Main heading)</label>
          <input className="form-input" type="text" value={txtTitle} onChange={(e) => this.setState({ txtTitle: e.target.value })} placeholder="e.g. Move fast. Look sharp." />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" value={txtDesc} onChange={(e) => this.setState({ txtDesc: e.target.value })} placeholder="Banner description..." rows="3" style={{ resize: 'vertical' }} />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Primary Button Text</label>
            <input className="form-input" type="text" value={txtPrimaryBtnText} onChange={(e) => this.setState({ txtPrimaryBtnText: e.target.value })} placeholder="Shop Now" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Primary Button Link</label>
            <input className="form-input" type="text" value={txtPrimaryBtnLink} onChange={(e) => this.setState({ txtPrimaryBtnLink: e.target.value })} placeholder="#new" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Secondary Button Text</label>
            <input className="form-input" type="text" value={txtSecondaryBtnText} onChange={(e) => this.setState({ txtSecondaryBtnText: e.target.value })} placeholder="Explore" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Secondary Button Link</label>
            <input className="form-input" type="text" value={txtSecondaryBtnLink} onChange={(e) => this.setState({ txtSecondaryBtnLink: e.target.value })} placeholder="#hot" />
          </div>
        </div>

        <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" checked={chkActive} onChange={(e) => this.setState({ chkActive: e.target.checked })} />
                Active
            </label>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {!isEdit && (
            <button className="btn btn-primary" style={{ flex: 1 }} disabled={saving}
              onClick={() => this.btnAddClick()}>
              {saving ? '⏳ Saving...' : '✚ Add New'}
            </button>
          )}
          {isEdit && (
            <>
              <button className="btn btn-success" style={{ flex: 1 }} disabled={saving}
                onClick={() => this.btnUpdateClick()}>
                {saving ? '⏳...' : '💾 Save'}
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => this.btnDeleteClick()}>
                🗑 Delete
              </button>
            </>
          )}
          <button className="btn btn-ghost btn-sm" onClick={() => this.reset()}>↺</button>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      if (!this.props.item) { this.reset(); return; }
      const item = this.props.item;
      const imgSrc = item.image
        ? (item.image.startsWith('http') || item.image.startsWith('data:')
          ? item.image : 'data:image/jpg;base64,' + item.image)
        : '';
      this.setState({
        txtID: item._id,
        txtKicker: item.kicker || '',
        txtTitle: item.title || '',
        txtDesc: item.desc || '',
        imgBanner: imgSrc,
        txtPrimaryBtnText: item.primaryBtnText || '',
        txtPrimaryBtnLink: item.primaryBtnLink || '',
        txtSecondaryBtnText: item.secondaryBtnText || '',
        txtSecondaryBtnLink: item.secondaryBtnLink || '',
        chkActive: item.active !== false
      });
    }
  }

  reset() {
    this.setState({
      txtID: '',
      txtKicker: '',
      txtTitle: '',
      txtDesc: '',
      imgBanner: '',
      txtPrimaryBtnText: '',
      txtPrimaryBtnLink: '',
      txtSecondaryBtnText: '',
      txtSecondaryBtnLink: '',
      chkActive: true
    });
  }

  async previewImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
        const base64 = evt.target.result;
        try {
            // Compress to max 1600px width/height for banners
            const compressed = await compressImage(base64, 1600, 1600, 0.8);
            this.setState({ imgBanner: compressed });
        } catch (err) {
            console.error('Compression error:', err);
            this.setState({ imgBanner: base64 }); // fallback
        }
    };
    reader.readAsDataURL(file);
  }

  validate() {
    const { txtTitle, imgBanner } = this.state;
    if (!txtTitle.trim()) { alert('Please enter title'); return false; }
    // if (!imgBanner) { alert('Please choose image'); return false; } // Optional if they want to keep previous
    return true;
  }

  buildPayload() {
    let imgBase64 = this.state.imgBanner;
    if (imgBase64 && imgBase64.startsWith('data:image')) {
        imgBase64 = imgBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    }
    
    return {
      kicker: this.state.txtKicker.trim(),
      title: this.state.txtTitle.trim(),
      desc: this.state.txtDesc.trim(),
      image: imgBase64,
      primaryBtnText: this.state.txtPrimaryBtnText.trim(),
      primaryBtnLink: this.state.txtPrimaryBtnLink.trim(),
      secondaryBtnText: this.state.txtSecondaryBtnText.trim(),
      secondaryBtnLink: this.state.txtSecondaryBtnLink.trim(),
      active: this.state.chkActive
    };
  }

  btnAddClick() {
    if (!this.validate()) return;
    this.setState({ saving: true });
    this.apiPostBanner(this.buildPayload());
  }
  btnUpdateClick() {
    if (!this.validate()) return;
    this.setState({ saving: true });
    this.apiPutBanner(this.state.txtID, this.buildPayload());
  }
  btnDeleteClick() {
    if (!window.confirm('Delete this banner?')) return;
    this.apiDeleteBanner(this.state.txtID);
  }

  apiPostBanner(banner) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/banners', banner, config)
      .then(() => { this.setState({ saving: false }); this.reset(); this.apiRefreshBanners(); })
      .catch((err) => { this.setState({ saving: false }); alert('❌ ' + (err.response?.data?.message || err.message)); });
  }
  apiPutBanner(id, banner) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/banners/' + id, banner, config)
      .then(() => { this.setState({ saving: false }); this.apiRefreshBanners(); })
      .catch((err) => { this.setState({ saving: false }); alert('❌ ' + (err.response?.data?.message || err.message)); });
  }
  apiDeleteBanner(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/banners/' + id, config)
      .then(() => { this.reset(); this.apiRefreshBanners(); })
      .catch((err) => alert('❌ ' + err.message));
  }
  apiRefreshBanners() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/banners', config).then((res) => {
      this.props.updateBanners(res.data);
    }).catch((err) => console.error(err.message));
  }
}

export default BannerDetail;
