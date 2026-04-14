require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose');
const { isMongoReady } = require('../utils/DbMode');
const { store, oid, clone } = require('../utils/InMemoryStore');

const BannerDAO = {
  async selectAll() {
    const banners = await Models.Banner.find({}).exec();
    return banners;
  },

  async selectByID(_id) {
    if (!isMongoReady()) {
      const banner = store.banners.find((b) => b._id === String(_id));
      return banner ? clone(banner) : null;
    }
    const banner = await Models.Banner.findById(_id).exec();
    return banner;
  },

  async insert(banner) {
    banner._id = new mongoose.Types.ObjectId();
    const result = await Models.Banner.create(banner);
    return result;
  },

  async update(banner) {
    const result = await Models.Banner.findByIdAndUpdate(banner._id, banner, { new: true });
    return result;
  },

  async delete(_id) {
    if (!isMongoReady()) {
      const idx = store.banners.findIndex((b) => b._id === String(_id));
      if (idx === -1) return null;
      const deleted = store.banners[idx];
      store.banners.splice(idx, 1);
      return clone(deleted);
    }
    const result = await Models.Banner.findByIdAndDelete(_id);
    return result;
  }
};

module.exports = BannerDAO;
