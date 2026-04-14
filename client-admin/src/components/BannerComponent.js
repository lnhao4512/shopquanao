import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import BannerDetail from './BannerDetailComponent';

class Banner extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      banners: [],
      item: null
    };
  }
  render() {
    const banners = this.state.banners.map((item) => {
      const imgSrc = item.image 
        ? (item.image.startsWith('http') || item.image.startsWith('data:') 
          ? item.image : 'data:image/jpg;base64,' + item.image)
        : '';
        
      return (
        <tr key={item._id} className={['admin-table-row', this.state.item?._id === item._id ? 'selected-row' : ''].join(' ')} onClick={() => this.trClick(item)}>
          <td className="td-id">{item._id}</td>
          <td style={{ fontWeight: 600 }}>{item.title}</td>
          <td>{item.kicker}</td>
          <td>
            {item.active 
              ? <span className="badge badge-green">Hoạt động</span> 
              : <span className="badge badge-gray">Nháp</span>}
          </td>
          <td>
            {imgSrc ? <img src={imgSrc} width="80" height="40" alt="" style={{ objectFit: 'cover', borderRadius: '4px' }} /> : '—'}
          </td>
        </tr>
      );
    });

    return (
      <div className="panel-split">
        {/* List panel */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Quản lý Banner</h2>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tiêu đề</th>
                  <th>Kicker</th>
                  <th>Trạng thái</th>
                  <th>Hình ảnh</th>
                </tr>
              </thead>
              <tbody>
                {banners}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        <BannerDetail 
          item={this.state.item} 
          updateBanners={(newBanners) => this.setState({ banners: newBanners })} 
        />
      </div>
    );
  }

  componentDidMount() {
    this.apiGetBanners();
  }

  trClick(item) {
    this.setState({ item: item });
  }

  apiGetBanners() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/banners', config).then((res) => {
      const result = res.data;
      this.setState({ banners: result });
    }).catch((err) => {
      console.error(err.message);
    });
  }
}

export default Banner;
